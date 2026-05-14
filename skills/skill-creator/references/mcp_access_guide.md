# MCP Documentation Access Guide

Add the `skills-spec` MCP server to access the official Agent Skills documentation from within an agent session. Once configured, two tools become available for searching and retrieving documentation pages.

---

## Server Details

| Property | Value |
| --- | --- |
| Name | `skills-spec` (any unique local name works) |
| URL | `https://agentskills.io/mcp` |
| Transport | HTTP / SSE |

---

## Configuring the MCP Server

Add the server to the agent framework currently in use. If the user has not specified a preference, configure it for the active agent environment without asking.

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` in the workspace root:

```json
{
  "servers": {
    "skills-spec": {
      "url": "https://agentskills.io/mcp",
      "type": "sse"
    }
  }
}
```

### Claude Code

```bash
claude mcp add --scope project skills-spec --transport http https://agentskills.io/mcp
```

This writes the entry to `.mcp.json` in the workspace root.

### Gemini CLI

Add to `.gemini/settings.json` in the workspace root:

```json
{
  "mcpServers": {
    "skills-spec": {
      "httpUrl": "https://agentskills.io/mcp"
    }
  }
}
```

### OpenAI Codex CLI

Add to the workspace config file (exact filename varies by version: `codex.md` or `.codex/config.json`):

```json
{
  "mcpServers": {
    "skills-spec": {
      "url": "https://agentskills.io/mcp"
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in the workspace root:

```json
{
  "mcpServers": {
    "skills-spec": {
      "url": "https://agentskills.io/mcp"
    }
  }
}
```

### Other Frameworks

The server follows the standard MCP HTTP/SSE protocol. Most MCP-capable agents accept a configuration block with the server `url`. Consult the framework's MCP configuration documentation and apply the pattern above.

After editing the config, restart the agent client or reload the MCP connection for the server to become available.

---

## Available Tools

### `search_agent_skills`

Search the Agent Skills knowledge base for documentation, examples, and guides.

| Parameter | Type | Required |
| --- | --- | --- |
| `query` | string | Yes |

Returns a list of result snippets with titles and page paths. Use this tool first to locate the relevant section before fetching a full page.

### `get_page_agent_skills`

Retrieve the full content of a documentation page by its path.

| Parameter | Type | Required |
| --- | --- | --- |
| `page` | string | Yes — path from a `search_agent_skills` result |

Use this when a search snippet is incomplete and the full page content is needed.

---

## Lookup Workflow

1. Call `search_agent_skills` with a focused query — e.g. `"name field constraints"`, `"progressive disclosure limits"`, `"bundled scripts"`.
2. If the returned snippet is insufficient, call `get_page_agent_skills` with the page path from the result.
3. Prefer documentation results over training knowledge when they conflict.
4. If both tools return nothing relevant, fall back to [spec_hard_rules.md](spec_hard_rules.md) and state the assumption explicitly.
