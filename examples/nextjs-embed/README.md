# Next.js embed example

Drop these two pieces into a Next.js App Router project to:

1. Render a contact form on `/contact` (browser, no API key exposed)
2. Proxy submissions to vendetus via a Route Handler (`/api/contact`)

## Setup

```bash
npm install @vendetus/sdk
```

Add to `.env.local`:

```
VENDETUS_API_KEY=pcsk_...
VENDETUS_CAR_ID=<your-car-uuid>
```

Get them from [app.vendetus.autos/integrations](https://app.vendetus.autos/integrations).

## Files

- [`app/contact/page.tsx`](./app/contact/page.tsx) — the form
- [`app/api/contact/route.ts`](./app/api/contact/route.ts) — server proxy

## Test

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","body":"Hola"}'
```

Should land in your vendetus inbox.
