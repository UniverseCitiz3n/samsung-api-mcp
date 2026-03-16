# Samsung API MCP Server

MCP server for the [Samsung Patch API](https://api.cloudaligned.pl) — query Samsung device firmware versions and available models directly from your AI assistant.

> **GET endpoints only** — this MCP does not expose any write/update operations.

## One-Click Install

[<img src="https://img.shields.io/badge/VS_Code-Install_MCP_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white" alt="Install in VS Code" />](https://insiders.vscode.dev/redirect/mcp/install?name=samsung-api&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22github%3AUniverseCitiz3n%2Fsamsung-api-mcp%23main%22%5D%7D)

The package is not published to npm yet, so the installer uses the public GitHub repository.

Or add manually to your VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "samsung-api": {
        "command": "npx",
        "args": ["-y", "github:UniverseCitiz3n/samsung-api-mcp#main"]
      }
    }
  }
}
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "samsung-api": {
      "command": "npx",
      "args": ["-y", "github:UniverseCitiz3n/samsung-api-mcp#main"]
    }
  }
}
```

## Tools

### `get_firmware`

Retrieve firmware versions for a Samsung device model.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | ✅ | Device model number (e.g. `SM-A356B`) |
| `csc` | string | | CSC region code (e.g. `EUX`, `DBT`) |
| `latest` | boolean | | Return only the latest firmware |

**Example prompts:**

- "What's the latest firmware for SM-A356B?"
- "Show me all firmware versions for SM-S928B in EUX region"
- "Get the latest Samsung Galaxy S24 Ultra firmware for DBT"

### `list_models`

List all Samsung device models available in the firmware database.

No parameters.

**Example prompts:**

- "What Samsung models are available?"
- "List all Samsung devices in the firmware database"

## Response Format

Firmware entries contain:

```json
{
  "csc": "EUX",
  "build": "A356BXXS4AYB1",
  "securityPatch": "2025-02-01",
  "releaseDate": "2025-02-17",
  "androidVersion": "U(Android 14)",
  "latest": "TRUE"
}
```

## API

This MCP server queries the public Samsung Patch API at `https://api.cloudaligned.pl`.

## License

MIT