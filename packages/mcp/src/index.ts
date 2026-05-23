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
  version: "0.1.0",
});

server.tool(
  "list_my_cars",
  "List all cars owned by the authenticated seller.",
  {
    status: z
      .enum(["draft", "active", "sold", "archived"])
      .optional()
      .describe("Filter by status"),
    limit: z.number().int().min(1).max(200).optional(),
  },
  async ({ status, limit }) => {
    const { cars } = await client.listMyCars({ status, limit });
    return { content: [{ type: "text", text: JSON.stringify(cars, null, 2) }] };
  },
);

server.tool(
  "get_car",
  "Get full details for a single car (by id).",
  { id: z.string().uuid() },
  async ({ id }) => {
    const { car } = await client.getCar(id);
    return { content: [{ type: "text", text: JSON.stringify(car, null, 2) }] };
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
  "List questions/comments left on a given car.",
  { carId: z.string().uuid() },
  async ({ carId }) => {
    const { comments } = await client.listComments(carId);
    return {
      content: [{ type: "text", text: JSON.stringify(comments, null, 2) }],
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
