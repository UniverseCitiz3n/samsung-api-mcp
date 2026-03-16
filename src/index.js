import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://api.cloudaligned.pl";

async function apiFetch(path, params = {}) {
  const url = new URL(path, API_BASE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString());
  const text = await response.text();

  if (!response.ok) {
    return { error: true, status: response.status, message: text };
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const server = new McpServer({
  name: "samsung-api-mcp",
  version: "1.0.0",
});

// Tool: get_firmware
server.tool(
  "get_firmware",
  "Retrieve Samsung firmware versions for a device model. Optionally filter by CSC region and/or return only the latest firmware.",
  {
    model: z.string().describe("Samsung device model number (e.g. SM-A356B, SM-S928B)"),
    csc: z.string().optional().describe("CSC region code to filter by (e.g. EUX, DBT, XEF)"),
    latest: z.boolean().optional().describe("When true, return only the latest firmware version(s)"),
  },
  async ({ model, csc, latest }) => {
    const params = { model };
    if (csc) params.csc = csc;
    if (latest) params.latest = "true";

    const result = await apiFetch("/get", params);

    if (result?.error) {
      return {
        content: [
          {
            type: "text",
            text: `Error ${result.status}: ${result.message}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// Tool: list_models
server.tool(
  "list_models",
  "List all Samsung device models available in the firmware database.",
  {},
  async () => {
    const result = await apiFetch("/models");

    if (result?.error) {
      return {
        content: [
          {
            type: "text",
            text: `Error ${result.status}: ${result.message}`,
          },
        ],
        isError: true,
      };
    }

    // Extract model names from KV key objects
    const models = Array.isArray(result)
      ? result.map((entry) => entry.name || entry).filter(Boolean)
      : result;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(models, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
