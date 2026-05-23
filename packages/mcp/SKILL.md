---
name: vendetus-autos
description: Integrate with vendetus.autos — embed listings, post questions/offers, fetch analytics, manage cars. All REST endpoints require a Pro/Dealer API key (Bearer auth). Covers public car/comment/offer endpoints, the authenticated seller API, the MCP server, embed widgets (loader + iframe, no key needed), and the integration patterns to use them safely.
---

# vendetus.autos integration

vendetus.autos is a car selling platform in Uruguay. Each car gets a free site at `<slug>.vendetus.autos`. Sellers can integrate their own websites via:

- **Embed widget** (no key): drop a `<div>` + `<script>` snippet, get a styled card
- **iframe** (no key): even simpler, no JS
- **Public REST API** (`/v1/public/*`): requires API key — for embedding read+write into your own site (proxy from your backend)
- **Authenticated REST API** (`/v1/cars/...`): for sellers managing their own data
- **MCP server**: AI agents calling the authenticated API via tools

## When to use this skill

- "Embed my car listing on my Wordpress site"
- "Show a list of all my dealership's cars on my custom site"
- "Build a contact form on my site that posts offers to vendetus"
- "Pull car photos via API"
- "What's my analytics for car X this week"
- "Update the price of my Vento programmatically"

## Quick decision tree

| Goal | Use |
|---|---|
| Show a car card on any site | Loader JS (`embed.js`) |
| Show a car in WordPress / Shopify | iframe |
| Custom-designed card on my own site | Public REST API + render |
| Receive questions/offers via my form | POST `/v1/public/cars/:id/(comments\|offers)` |
| Manage my own inventory | Authenticated REST API + API key |
| AI agent for inventory ops | MCP server |

## Public REST API (requires API key)

Base: `https://api.vendetus.autos/v1/public`

**All endpoints require `Authorization: Bearer pcsk_...`.** CORS open for all origins, but the key requirement means: proxy from your backend (don't expose the key in the browser). Rate-limited per IP (5 comments/min, 3 offers/min) in addition to the key check.

Get a key from `https://app.vendetus.autos/integrations` (requires Pro or Dealer plan).

### `GET /v1/public/cars/:slugOrId`

```bash
curl https://api.vendetus.autos/v1/public/cars/volkswagen-vento-wokpy4 \
  -H "Authorization: Bearer pcsk_..."
```

Returns:
```json
{
  "car": {
    "id": "uuid",
    "slug": "volkswagen-vento-wokpy4",
    "title": "Volkswagen Vento GLI 2016",
    "make": "Volkswagen",
    "model": "Vento GLI",
    "year": 2016,
    "km": 65000,
    "price": 28800,
    "currency": "USD",
    "description": "...",
    "location_dept": "MONTEVIDEO",
    "featured": false,
    "public_url": "https://volkswagen-vento-wokpy4.vendetus.autos",
    "dealership": null,
    "photos": [{ "id": "...", "url": "https://...png", "position": 0 }]
  }
}
```

### `GET /v1/public/cars/:id/comments`

Returns public questions on the car: `[{ id, body, created_at }]`. Author names are not exposed publicly.

### `POST /v1/public/cars/:id/comments`

```json
{
  "author_name": "Juan",
  "author_email": "opcional@example.com",
  "body": "Está disponible?"
}
```

Honeypot field `website` (must be empty). Min body 5 chars, max 2000.

### `POST /v1/public/cars/:id/offers`

```json
{
  "type": "cash" | "trade" | "trade_plus_cash",
  "cash_amount": 22000,
  "cash_currency": "USD",
  "trade_make": "Toyota",
  "trade_model": "Etios",
  "trade_year": 2019,
  "trade_km": 80000,
  "trade_notes": "...",
  "contact_name": "Juan",
  "contact_email": "...",
  "contact_phone": "+598..."
}
```

At least one of `contact_email` or `contact_phone` required.

For `cash` type, only cash fields. For `trade`, only trade fields. For `trade_plus_cash`, both.

## Embed widgets

### Loader (recommended)

```html
<div data-vendetus-car="mi-slug"></div>
<script src="https://vendetus.autos/embed.js" async></script>
```

Loader creates a responsive iframe to `vendetus.autos/embed/car/<slug>`. Optional `data-height="N"`. Auto-detects multiple embeds and re-scans on DOM mutations (SPA-friendly).

### Direct iframe

```html
<iframe
  src="https://vendetus.autos/embed/car/mi-slug"
  width="100%"
  height="560"
  style="border:0;"
></iframe>
```

## Authenticated REST API

Base: `https://api.vendetus.autos/v1`

Header: `Authorization: Bearer pcsk_...`

Get a key from `https://app.vendetus.autos/integrations` (requires Pro or Dealer plan).

### Endpoints

- `GET /v1/cars` (list owner's cars; `?status=` filter)
- `GET /v1/cars/:id` (with photos)
- `PATCH /v1/cars/:id` (write scope; updates: title, price, currency, status, description, km, color)
- `GET /v1/cars/:id/offers`
- `GET /v1/cars/:id/comments` (includes private + public, with author names)
- `GET /v1/cars/:id/analytics?days=30` (totals, unique sessions, daily views, top referrers)

## MCP

Install:
```bash
claude mcp add vendetus-autos --env VENDETUS_API_KEY=pcsk_... -- npx -y vendetus-mcp
```

Exposes 6 tools wrapping the authenticated API: `list_my_cars`, `get_car`, `update_car`, `list_offers`, `list_comments`, `get_analytics`.

## Plans / quotas

| Plan | Photos/car | API keys | Custom subdomain | Dealership | Featured |
|---|---|---|---|---|---|
| Free | 10 | ❌ | ❌ | ❌ | ❌ |
| Pro | 30 | ✓ | ✓ | ❌ | ✓ |
| Dealer | 50 | ✓ | ✓ | ✓ | ✓ |

Custom domain (BYO) → via Support request, not self-serve.

## Errors

| HTTP | Meaning |
|---|---|
| 400 | Invalid body / missing required fields |
| 401 | Missing or invalid API key (authenticated routes) |
| 403 | Key lacks scope (e.g. `write` for PATCH) |
| 404 | Car not found, or inactive, or not owned by your key |
| 429 | Rate limited (public POST endpoints) |
| 5xx | Platform issue — retry with exponential backoff |

## Photo URLs

All photos in `car.photos[].url` are public Supabase Storage CDN URLs. No transformation API yet — fetch the original and resize client-side if needed. Max upload size 10 MB, formats jpg/png/webp/avif.

## Webhooks (not yet)

Real-time notifications for new_offer / new_comment / car_sold are on the roadmap. Until then, poll `GET /v1/cars/:id/offers` and `comments` periodically. Or have your AI agent check via MCP.
