#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { VendetusClient } from "@vendetus/sdk";

const apiKey = process.env.VENDETUS_API_KEY;
if (!apiKey) {
  console.error(
    "[vendetus-mcp] VENDETUS_API_KEY env var is required (generate at https://app.vendetus.autos/integrations)",
  );
  process.exit(1);
}

const client = new VendetusClient({
  apiKey,
  baseUrl: process.env.VENDETUS_API_URL ?? undefined,
});

const server = new McpServer({
  name: "vendetus-autos",
  version: "0.2.0",
});

const URL_USAGE_NOTE =
  "integration_urls.api is the canonical endpoint to fetch this car's data — use it for ALL programmatic access. integration_urls.public_page is a browser-facing HTML landing page; never fetch JSON from it or append paths to it. integration_urls.embed is the iframe src for embed widgets only.";

function buildUrls(slug: string) {
  return {
    api: `https://api.vendetus.autos/v1/public/cars/${slug}`,
    embed: `https://vendetus.autos/embed/car/${slug}`,
    public_page: `https://${slug}.vendetus.autos`,
  };
}

function withUrls<T extends { slug: string }>(car: T) {
  return { ...car, integration_urls: buildUrls(car.slug) };
}

server.tool(
  "list_my_cars",
  "List all cars owned by the authenticated seller. Each returned car includes an integration_urls block — use integration_urls.api as the data endpoint, never the public_page subdomain.",
  {
    status: z
      .enum(["draft", "active", "sold", "archived"])
      .optional()
      .describe("Filter by status"),
    limit: z.number().int().min(1).max(200).optional(),
  },
  async ({ status, limit }) => {
    const { cars } = await client.listMyCars({ status, limit });
    const payload = {
      cars: cars.map(withUrls),
      _note: URL_USAGE_NOTE,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    };
  },
);

server.tool(
  "get_car",
  "Get full details for a single car (by id). Response includes an integration_urls block — use integration_urls.api as the canonical data endpoint for any subsequent fetch, never the public_page subdomain.",
  { id: z.string().uuid() },
  async ({ id }) => {
    const { car } = await client.getCar(id);
    const payload = {
      car: withUrls(car),
      _note: URL_USAGE_NOTE,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    };
  },
);

server.tool(
  "update_car",
  "Update fields on a car. Only the owner can update.",
  {
    id: z.string().uuid(),
    title: z.string().min(1).max(100).optional(),
    price: z.number().positive().optional(),
    currency: z.enum(["UYU", "USD"]).optional(),
    description: z.string().max(5000).nullable().optional(),
    status: z
      .enum(["draft", "active", "sold", "archived"])
      .optional(),
    km: z.number().int().min(0).nullable().optional(),
    color: z.string().max(40).nullable().optional(),
  },
  async ({ id, ...patch }) => {
    const { car } = await client.updateCar(id, patch);
    return { content: [{ type: "text", text: JSON.stringify(car, null, 2) }] };
  },
);

server.tool(
  "list_offers",
  "List offers received on a given car.",
  { carId: z.string().uuid() },
  async ({ carId }) => {
    const { offers } = await client.listOffers(carId);
    return {
      content: [{ type: "text", text: JSON.stringify(offers, null, 2) }],
    };
  },
);

server.tool(
  "list_comments",
  "List questions left on a given car. Each comment has optional answer_body + answer_at fields — when present, that answer is already published publicly under the question. Use respond_to_comment to publish a new answer or replace an existing one.",
  { carId: z.string().uuid() },
  async ({ carId }) => {
    const { comments } = await client.listComments(carId);
    return {
      content: [{ type: "text", text: JSON.stringify(comments, null, 2) }],
    };
  },
);

server.tool(
  "respond_to_comment",
  "Publicly answer a question on the seller's car. The answer renders inline under the question on the public car page (<slug>.vendetus.autos). Pass body: null to clear an existing answer. Supports inline markdown: **bold** and *italic* (italic renders as the brand-whisper accent style).",
  {
    commentId: z.string().uuid(),
    body: z
      .string()
      .min(1)
      .max(4000)
      .nullable()
      .describe("Answer text, or null to remove an existing answer."),
  },
  async ({ commentId, body }) => {
    const { comment } = await client.answerComment(commentId, body);
    return {
      content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
    };
  },
);

server.tool(
  "get_analytics",
  "Get analytics for a car over the last N days (default 30).",
  {
    carId: z.string().uuid(),
    days: z.number().int().min(1).max(180).optional(),
  },
  async ({ carId, days }) => {
    const data = await client.getAnalytics(carId, { days });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

await server.connect(new StdioServerTransport());
