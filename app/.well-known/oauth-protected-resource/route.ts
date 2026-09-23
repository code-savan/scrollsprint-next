import {
  SCROLLSPRINT_MCP_RESOURCE,
  SCROLLSPRINT_OAUTH_ISSUER,
  SCROLLSPRINT_OAUTH_SCOPES,
} from "@/lib/scrollsprint-oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      resource: SCROLLSPRINT_MCP_RESOURCE,
      authorization_servers: [SCROLLSPRINT_OAUTH_ISSUER],
      scopes_supported: [...SCROLLSPRINT_OAUTH_SCOPES],
      bearer_methods_supported: ["header"],
      resource_documentation: "https://www.scrollsprint.online/admin/higgsfield",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    },
  );
}
