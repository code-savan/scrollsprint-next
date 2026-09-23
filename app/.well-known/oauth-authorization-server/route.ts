import {
  SCROLLSPRINT_OAUTH_ISSUER,
  SCROLLSPRINT_OAUTH_SCOPES,
} from "@/lib/scrollsprint-oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      issuer: SCROLLSPRINT_OAUTH_ISSUER,
      authorization_endpoint: `${SCROLLSPRINT_OAUTH_ISSUER}/oauth/authorize`,
      token_endpoint: `${SCROLLSPRINT_OAUTH_ISSUER}/oauth/token`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      scopes_supported: [...SCROLLSPRINT_OAUTH_SCOPES],
      client_id_metadata_document_supported: true,
      authorization_response_iss_parameter_supported: true,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    },
  );
}
