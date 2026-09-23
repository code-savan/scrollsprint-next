import { createMcpHandler } from "@modelcontextprotocol/server";

import { buildHiggsfieldMcpServer } from "@/lib/higgsfield-mcp";
import { validateMcpBearer } from "@/lib/scrollsprint-oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESOURCE_METADATA =
  "https://www.scrollsprint.online/.well-known/oauth-protected-resource";

const handler = createMcpHandler(() => buildHiggsfieldMcpServer(), {
  responseMode: "json",
  legacy: "stateless",
});

function isAllowedHost(request: Request) {
  const hostname = new URL(request.url).hostname.toLowerCase();
  return (
    hostname === "scrollsprint.online" ||
    hostname === "www.scrollsprint.online" ||
    hostname.endsWith(".vercel.app")
  );
}

async function serve(request: Request) {
  if (!isAllowedHost(request)) {
    return Response.json({ error: "Forbidden host" }, { status: 403 });
  }

  if (!validateMcpBearer(request)) {
    return Response.json(
      {
        error: "Unauthorized MCP request",
        hint: "Connect this MCP server through OAuth 2.1 in ChatGPT.",
      },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": `Bearer resource_metadata="${RESOURCE_METADATA}", scope="higgsfield.read higgsfield.generate offline_access"`,
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return handler.fetch(request);
}

export const GET = serve;
export const POST = serve;
export const DELETE = serve;
