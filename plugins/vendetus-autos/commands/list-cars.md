---
description: List the user's own cars from vendetus.autos (uses the MCP server)
argument-hint: [active|sold|draft|archived]
---

The user wants to see their own cars on vendetus.autos. Useful for building a custom inventory page on their site.

**Argument**: `$ARGUMENTS` — optional status filter. Pass through to the MCP tool.

## What to do

1. Call `mcp__vendetus-autos__list_my_cars` (pass the status filter if provided).
2. Render the result as a markdown table: title, status, price+currency, km, public_url.
3. If the user asked for this as part of building a UI (e.g. "list my cars on my site"), then also offer to scaffold a component that fetches the list at request time:
   - Next.js: server component using `fetch(https://api.vendetus.autos/v1/cars)` with `Authorization: Bearer ${VENDETUS_API_KEY}` — NOTE this uses the **authenticated** endpoint (`/v1/cars`, not `/v1/public/cars/...`)
   - SPA: backend proxy required
4. Suggest `/vendetus-autos:fetch-car <slug>` to drill into one car's detail.
