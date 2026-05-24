---
description: Scaffold a frontend form (comment or offer) that posts to the user's backend proxy route
argument-hint: <comment|offer> [car-slug-or-id]
---

The user wants a frontend form on their site that lets visitors submit a public question or an offer on a specific car.

**Arguments**: `$ARGUMENTS` — first token is `comment` or `offer`. Second token is the car id or slug. If missing, ask.

## Pre-flight

This form posts to the user's OWN backend (NOT directly to vendetus.autos), to keep the API key server-side. If they don't already have a backend proxy route, suggest running `/vendetus-autos:proxy-route` first.

## What to do

1. Detect the frontend framework from the repo (React/Next, Vue, Svelte, plain HTML).
2. Generate a form matching the chosen mode:
   - **comment**: `author_name` (required), `author_email` (optional), `body` (textarea, 5–2000 chars), honeypot `website` input (hidden, must be empty)
   - **offer**: `type` selector (`cash` | `trade` | `trade_plus_cash`), conditional fields:
     - `cash`: `cash_amount`, `cash_currency` (USD/UYU)
     - `trade`: `trade_make`, `trade_model`, `trade_year`, `trade_km`, `trade_notes`
     - `trade_plus_cash`: both
     - Always: `contact_name`, `contact_email` OR `contact_phone` (at least one)
3. On submit, POST JSON to the user's local proxy route (e.g. `/api/vendetus/comments` or `/api/vendetus/offers`), passing the car id/slug as a path param or in the body.
4. Show loading / success / error states. Display upstream validation errors from the proxy response.
5. Use framework-idiomatic patterns (RHF + zod on Next, vee-validate on Vue, etc. — only if the project already uses them; otherwise plain useState).
6. After scaffolding, tell the user where the form lives + how to test it.

Keep it tasteful — minimal Tailwind / vanilla CSS matching whatever the project already uses. Do NOT add new design dependencies.
