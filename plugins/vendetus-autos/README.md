# vendetus-autos plugin

Claude Code plugin for integrating any website with [vendetus.autos](https://vendetus.autos) — the car selling platform for Uruguay.

## What you get

Installing this plugin in Claude Code wires up **three things at once**:

1. **MCP server** (`vendetus-autos`) — 6 tools wrapping the authenticated REST API: `list_my_cars`, `get_car`, `update_car`, `list_offers`, `list_comments`, `get_analytics`. Auto-configured with your API key.
2. **Skill** (`vendetus-autos`) — comprehensive integration guide auto-loaded by the agent: REST endpoints, public + authenticated API, embed widgets, error codes, plans, photo URLs.
3. **Slash commands** for the integrator workflow:
   - `/vendetus-autos:embed <slug>` — generate loader or iframe embed snippet
   - `/vendetus-autos:proxy-route` — scaffold a backend proxy (keeps API key server-side)
   - `/vendetus-autos:form <comment|offer> <slug>` — scaffold a frontend form posting to your proxy
   - `/vendetus-autos:fetch-car <slug>` — fetch + render a custom UI for one car
   - `/vendetus-autos:list-cars [status]` — list your own cars (uses MCP)

## Install

```bash
# In Claude Code
/plugin marketplace add matintosh/vendetus-autos
/plugin install vendetus-autos@vendetus
```

You'll be prompted for your **Vendetus API key** during install — get one at [app.vendetus.autos/integrations](https://app.vendetus.autos/integrations) (requires Pro or Dealer plan). It's stored securely in the system keychain.

## Try it

After install, from any project:

```
/vendetus-autos:embed volkswagen-vento-wokpy4
```

…and the agent generates an embed snippet (loader JS or iframe) for that car, optionally inserting it into the file you're working on.

Or hand it a high-level request — the skill kicks in automatically:

> "Add a contact form on my homepage that posts questions to my Vento listing on vendetus."

The agent will scaffold a backend proxy, a frontend form, wire up the API key from env, and tell you how to test it.

## Requirements

- A vendetus.autos seller account on Pro or Dealer plan (for the API key — embed widgets work without a key)
- `npx` available (the MCP server runs via `npx -y @vendetus/mcp`)

## Links

- Plugin source: [github.com/matintosh/vendetus-autos](https://github.com/matintosh/vendetus-autos)
- Docs: [vendetus.autos/docs](https://vendetus.autos/docs)
- npm packages: [`@vendetus/mcp`](https://npmjs.com/package/@vendetus/mcp), [`@vendetus/sdk`](https://npmjs.com/package/@vendetus/sdk)

## License

MIT
