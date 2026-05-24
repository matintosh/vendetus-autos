---
description: Fetch a car's details from vendetus.autos and render a custom UI (uses the MCP server)
argument-hint: <car-slug-or-id>
---

The user wants to display a car from vendetus.autos with custom design (not the embed widget).

**Argument**: `$ARGUMENTS` — car slug or id. If missing, prompt for it (e.g. `volkswagen-vento-wokpy4`).

## CRITICAL — URL routing rules

Vendetus has two distinct hosts. Do not confuse them:

- **`https://api.vendetus.autos/v1/...`** — REST API, returns JSON. Use this for ALL data fetching.
- **`https://<slug>.vendetus.autos`** — public landing page, returns HTML. **NEVER fetch from here**, never POST to it, never append `/comments` or `/offers` to it. The server returns 421 with a hint if you try.

When the MCP tool returns a car, it includes an `integration_urls` block — always read `integration_urls.api` as the canonical data endpoint. The `public_page` field is only for "view on vendetus" browser links shown to the end user.

## What to do

1. Call the MCP tool `mcp__vendetus-autos__get_car` with the slug/id to fetch the full payload (id, title, make, model, year, km, price, currency, description, photos[], public_url, dealership, etc).
2. If the user has not yet picked a target file/component, ask what they want to render in (e.g. "a new React component", "into this existing page", etc).
3. Generate the UI using the project's existing patterns:
   - Component file in the right place (e.g. `app/cars/[slug]/page.tsx` on Next App Router)
   - Uses the project's existing styling primitives (Tailwind, CSS modules, etc) — do not add new design deps
   - Photos rendered as a responsive gallery (first photo as hero, rest as thumbnails)
   - Price formatted with the right currency symbol (USD `$`, UYU `$U`)
   - Spec table for make/model/year/km
   - CTA link to `car.public_url` ("Ver en vendetus" or "Contactar al vendedor")
4. Decide rendering strategy based on the framework:
   - Next.js App Router → server component, fetch with `fetch()` to `https://api.vendetus.autos/v1/public/cars/<id>`, key from `process.env.VENDETUS_API_KEY` (NEVER expose in client)
   - SPA / pure client → MUST go through a backend proxy route (run `/vendetus-autos:proxy-route` first)
   - Static site → use the embed widget instead, suggest `/vendetus-autos:embed`
5. After generating, run the dev server (or tell the user how) so they can verify.

## Photo URL note

`car.photos[].url` is a Supabase Storage CDN URL — public, no signing needed. Original resolution; resize client-side via `<img>` styles or Next/Image if needed.
