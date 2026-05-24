---
description: Scaffold a backend proxy route that forwards browser form posts to the vendetus.autos public API (so the API key stays server-side)
argument-hint: [framework: next|express|hono|sveltekit]
---

The user wants to receive questions/offers from a form on their site and forward them to vendetus.autos without exposing the API key in the browser.

**Pattern**: browser → POST to user's own backend → backend adds `Authorization: Bearer ${VENDETUS_API_KEY}` → forwards to `https://api.vendetus.autos/v1/public/cars/:id/(comments|offers)`.

**Argument**: `$ARGUMENTS` — optional framework hint. If omitted, detect from the repo (`package.json`, file structure).

## What to do

1. Detect the framework if not specified. Default to whatever matches the repo.
2. Create TWO endpoints (or two handlers in one file if the framework prefers): one for comments, one for offers.
3. Each endpoint:
   - Validates `car_id` from the URL or body
   - Reads body JSON from the request
   - Forwards verbatim to `https://api.vendetus.autos/v1/public/cars/${car_id}/(comments|offers)` with the `Authorization` header
   - Returns the upstream JSON + status code transparently (proxy semantics)
4. Use `process.env.VENDETUS_API_KEY` (Node) / `Bun.env` (Bun) / framework-idiomatic env access.
5. Tell the user to set `VENDETUS_API_KEY` in their `.env` (and in Vercel/host env vars for prod).
6. Note rate limits: 5 comments/min/IP, 3 offers/min/IP — enforced upstream, no need to re-implement.
7. After scaffolding, show a `curl` example to test the new endpoint.

## Required fields reference

**Comments POST body:**
```json
{ "author_name": "string", "author_email": "string?", "body": "string (5-2000 chars)" }
```

**Offers POST body** (one of `cash` | `trade` | `trade_plus_cash`):
```json
{
  "type": "cash",
  "cash_amount": 22000,
  "cash_currency": "USD",
  "contact_name": "string",
  "contact_email": "string?",
  "contact_phone": "string?"
}
```
(`contact_email` OR `contact_phone` required.)

For `trade`: include `trade_make`, `trade_model`, `trade_year`, `trade_km`, optional `trade_notes`.
For `trade_plus_cash`: both cash fields and trade fields.

Do not write a hand-rolled schema validator — just forward the body and let the upstream API return 400 with validation errors.
