# vendetus-mcp

MCP server for [vendetus.autos](https://vendetus.autos) — read and update your car listings, offers, comments, and analytics from any MCP-compatible AI agent (Claude Code, Cursor, Claude Desktop, etc).

## Install

Get an API key first from [app.vendetus.autos/integrations](https://app.vendetus.autos/integrations) (requires Pro or Dealer plan).

### Claude Code

```bash
claude mcp add vendetus-autos --env VENDETUS_API_KEY=pcsk_... -- npx -y vendetus-mcp
```

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vendetus-autos": {
      "command": "npx",
      "args": ["-y", "vendetus-mcp"],
      "env": {
        "VENDETUS_API_KEY": "pcsk_..."
      }
    }
  }
}
```

### Cursor

Settings → MCP → Add new MCP server, same config as Claude Desktop.

## Tools exposed

| Tool | What it does |
|---|---|
| `list_my_cars` | List all your published cars (optional status filter) |
| `get_car` | Full details for a single car including photos |
| `update_car` | Update title, price, currency, status, description, km, color |
| `list_offers` | List offers received on a car |
| `list_comments` | List questions left on a car |
| `get_analytics` | 30-day views, unique sessions, funnel, top referrers |

## Example prompts

> "Show me all my active cars"
> "Update the price of car X to 25000 USD"
> "What's the analytics breakdown for car Y this past week?"
> "List today's offers across all my cars and summarize"

## Env vars

- `VENDETUS_API_KEY` (required) — API key from [app.vendetus.autos/integrations](https://app.vendetus.autos/integrations)
- `VENDETUS_API_URL` (optional) — defaults to `https://api.vendetus.autos`

## Skill bundle

For richer agent guidance, install the companion Skill:

```bash
npx skills add vendetus/vendetus-skill
```

Or copy [`SKILL.md`](./SKILL.md) into your project's `.claude/skills/` folder.

## License

MIT
