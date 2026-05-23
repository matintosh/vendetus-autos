# vendetus-autos · public integrations

Public packages, skills, and examples for integrating with
[vendetus.autos](https://vendetus.autos) — the car selling platform for
Uruguay.

This repo contains:

| Path | What |
|---|---|
| [`packages/mcp`](./packages/mcp) | `vendetus-mcp` MCP server (npm) — exposes 6 tools to AI agents |
| [`packages/sdk`](./packages/sdk) | `@vendetus/sdk` typed REST client (npm) |
| [`skills/`](./skills) | `SKILL.md` for Claude Code / Cursor / Copilot |
| [`examples/`](./examples) | Drop-in integration templates |

Backend / app source stays in a separate private repo.

---

## Quick links

- **Docs hub** → https://vendetus.autos/docs
- **REST API** → https://vendetus.autos/docs/api
- **MCP guide** → https://vendetus.autos/docs/mcp
- **Embed widget** → https://vendetus.autos/docs/embed
- **Generate an API key** → https://app.vendetus.autos/integrations (Pro/Dealer)

## Installing the MCP server (TL;DR)

```bash
claude mcp add vendetus-autos \
  --env VENDETUS_API_KEY=pcsk_... \
  -- npx -y vendetus-mcp
```

## Installing the SDK

```bash
npm install @vendetus/sdk
```

```ts
import { VendetusClient } from "@vendetus/sdk";

const client = new VendetusClient({ apiKey: process.env.VENDETUS_API_KEY! });
const { cars } = await client.listMyCars({ status: "active" });
```

## Embedding a listing on any site

```html
<div data-vendetus-car="tu-auto-slug"></div>
<script src="https://vendetus.autos/embed.js" async></script>
```

## Examples

- [`examples/nextjs-embed`](./examples/nextjs-embed) — Next.js page that lists
  a dealership's inventory using the SDK + posts offers from a contact form
- [`examples/node-cli`](./examples/node-cli) — bulk-update prices on cars
  matching a make/model

Add yours: PRs welcome.

## Contributing

Issues and PRs welcome. For platform bugs or feature requests, open a
[support request](https://app.vendetus.autos/support/new) instead — that
goes straight to our inbox.

## License

MIT
