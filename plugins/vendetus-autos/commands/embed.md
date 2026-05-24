---
description: Generate an embed snippet (loader JS or iframe) for a vendetus.autos car listing
argument-hint: <car-slug> [loader|iframe]
---

The user wants to embed a vendetus.autos car listing in their website.

**Argument**: `$ARGUMENTS` — first token is the car slug (e.g. `volkswagen-vento-wokpy4`), optional second token is the mode (`loader` or `iframe`, default `loader`).

If the slug is missing, ask the user for it (it's the public URL prefix at `<slug>.vendetus.autos`).

## Modes

**Loader (default, recommended)** — single line, works on any HTML page including SPAs, auto-resizes:
```html
<div data-vendetus-car="<slug>"></div>
<script src="https://vendetus.autos/embed.js" async></script>
```

**iframe** — zero JS, fixed height:
```html
<iframe
  src="https://vendetus.autos/embed/car/<slug>"
  width="100%"
  height="560"
  style="border:0; border-radius:8px;"
></iframe>
```

## What to do

1. Detect the user's stack from the current repo (look at `package.json`, file extensions, framework files).
2. Generate the snippet for the requested mode (or both if unclear), with the slug substituted in.
3. If the project is React/Next.js/Vue/Svelte, also show the framework-idiomatic wrapper (e.g. a `<VendetusCar slug="..." />` component that mounts the loader on `useEffect`).
4. If the user picks loader mode, mention the optional `data-height="N"` attribute.
5. Do NOT recommend the iframe pattern for SPAs that change routes without reload (the embed.js loader auto-rescans the DOM via MutationObserver; raw iframe won't).
6. No API key required for embeds.

If a target file is implied (e.g. they say "add this to the homepage"), edit the file. Otherwise just print the snippet.
