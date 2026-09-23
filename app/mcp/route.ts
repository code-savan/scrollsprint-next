import { timingSafeEqual } from "node:crypto";

import { createMcpHandler } from "@modelcontextprotocol/server";

import { buildHiggsfieldMcpServer } from "@/lib/higgsfield-mcp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = createMcpHandler(() => buildHiggsfieldMcpServer(), {
  responseMode: "json",
  legacy: "stateless",
});

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

function isAllowedHost(request: Request) {
  const hostname = new URL(request.url).hostname.toLowerCase();
  return (
    hostname === "scrollsprint.online" ||
    hostname === "www.scrollsprint.online" ||
    hostname.endsWith(".vercel.app")
  );
}

function isAuthorized(request: Request) {
  const expected =
    process.env.SCROLLSPRINT_MCP_TOKEN?.trim() ||
    process.env.SCROLLSPRINT_CONNECTOR_TOKEN?.trim();

  if (!expected) return false;

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("access")?.trim();
  const bearer = request.headers.get("authorization");
  const bearerToken = bearer?.startsWith("Bearer ") ? bearer.slice(7).trim() : null;
  const headerToken = request.headers.get("x-scrollsprint-token")?.trim();
  const supplied = bearerToken || headerToken || queryToken;

  return Boolean(supplied && safeEqual(supplied, expected));
}

async function serve(request: Request) {
  if (!isAllowedHost(request)) {
    return Response.json({ error: "Forbidden host" }, { status: 403 });
  }

  if (!isAuthorized(request)) {
    return Response.json(
      {
        error: "Unauthorized MCP request",
        hint: "Use the private MCP connection URL or an authorized bearer token.",
      },
      { status: 401 },
    );
  }

  return handler.fetch(request);
}

export const GET = serve;
export const POST = serve;
export const DELETE = serve;
