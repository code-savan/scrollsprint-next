import {
  exchangeAuthorizationCode,
  isAllowedChatGptClient,
  refreshAccessToken,
  SCROLLSPRINT_MCP_RESOURCE,
} from "@/lib/scrollsprint-oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function oauthError(error: string, description: string, status = 400) {
  return Response.json(
    { error, error_description: description },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return oauthError("invalid_request", "Token endpoint requires form-urlencoded input");
  }

  const form = await request.formData();
  const grantType = String(form.get("grant_type") || "");
  const clientId = String(form.get("client_id") || "");
  const resource = String(form.get("resource") || SCROLLSPRINT_MCP_RESOURCE);

  if (!isAllowedChatGptClient(clientId)) {
    return oauthError("invalid_client", "Unsupported OAuth client", 401);
  }

  if (resource !== SCROLLSPRINT_MCP_RESOURCE) {
    return oauthError("invalid_target", "Invalid OAuth resource");
  }

  if (grantType === "authorization_code") {
    const code = String(form.get("code") || "");
    const codeVerifier = String(form.get("code_verifier") || "");
    const redirectUri = String(form.get("redirect_uri") || "");

    if (!code || !codeVerifier || !redirectUri) {
      return oauthError("invalid_request", "code, code_verifier, and redirect_uri are required");
    }

    const tokens = exchangeAuthorizationCode({
      code,
      codeVerifier,
      clientId,
      redirectUri,
      resource,
    });

    if (!tokens) {
      return oauthError("invalid_grant", "Authorization code or PKCE verifier is invalid");
    }

    return Response.json(tokens, {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    });
  }

  if (grantType === "refresh_token") {
    const refreshToken = String(form.get("refresh_token") || "");
    if (!refreshToken) {
      return oauthError("invalid_request", "refresh_token is required");
    }

    const tokens = refreshAccessToken({ refreshToken, clientId, resource });
    if (!tokens) {
      return oauthError("invalid_grant", "Refresh token is invalid or expired");
    }

    return Response.json(tokens, {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    });
  }

  return oauthError("unsupported_grant_type", "Only authorization_code and refresh_token are supported");
}
