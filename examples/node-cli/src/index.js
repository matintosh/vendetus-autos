#!/usr/bin/env node
import { VendetusClient } from "@vendetus/sdk";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    match: { type: "string" },
    multiplier: { type: "string" },
    dry: { type: "boolean", default: false },
  },
});

const apiKey = process.env.VENDETUS_API_KEY;
if (!apiKey) {
  console.error("VENDETUS_API_KEY env var required");
  process.exit(1);
}

const match = values.match;
const multiplier = Number(values.multiplier);
if (!match || !Number.isFinite(multiplier) || multiplier <= 0) {
  console.error("Usage: --match <substring> --multiplier <number> [--dry]");
  process.exit(1);
}

const client = new VendetusClient({ apiKey });

const { cars } = await client.listMyCars({ status: "active", limit: 200 });
const matching = cars.filter(
  (c) =>
    c.title.toLowerCase().includes(match.toLowerCase()) ||
    c.model.toLowerCase().includes(match.toLowerCase()),
);

console.log(`Matched ${matching.length} cars`);

for (const car of matching) {
  const next = Math.round(car.price * multiplier);
  console.log(
    `  ${car.title}: ${car.price} ${car.currency} → ${next} ${car.currency}${values.dry ? " (dry)" : ""}`,
  );
  if (!values.dry) {
    await client.updateCar(car.id, { price: next });
  }
}

console.log(values.dry ? "Dry-run complete." : "Done.");
