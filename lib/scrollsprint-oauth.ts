import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

export const SCROLLSPRINT_OAUTH_ISSUER = "https://www.scrollsprint.online";
export const SCROLLSPRINT_MCP_RESOURCE = "https://www.scrollsprint.online/mcp";
export const SCROLLSPRINT_OAUTH_SCOPES = [
  "higgsfield.read",
  "higgsfield.generate",
  "offline_access",
] as const;

type TokenType = "authorization_code" | "access_token" | "refresh_token";

type SignedPayload = {
  typ: TokenType;
  iat: number;
  exp: number;
  jti: string;
  client_id: string;
  scope: string;
  resource: string;
  redirect_uri?: string;
  code_challenge?: string;
  sub?: string;
};

function oauthSecret() {
  const secret =
    process.env.SCROLLSPRINT_MCP_TOKEN?.trim() ||
    process.env.SCROLLSPRINT_CONNECTOR_TOKEN?.trim();

  if (!secret) {
    throw new Error("ScrollSprint OAuth secret is not configured");
  }

  return secret;
}

function encode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(body: string) {
  return createHmac("sha256", oauthSecret()).update(body).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(payload: Omit<SignedPayload, "iat" | "exp" | "jti">, ttlSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const body = encode(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + ttlSeconds,
      jti: randomUUID(),
    } satisfies SignedPayload),
  );

  return `${body}.${signature(body)}`;
}

function verify(token: string, expectedType: TokenType): SignedPayload | null {
  const [body, suppliedSignature, extra] = token.split(".");
  if (!body || !suppliedSignature || extra) return null;
  if (!safeEqual(signature(body), suppliedSignature)) return null;

  try {
    const payload = JSON.parse(decode(body)) as SignedPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.typ !== expectedType || payload.exp <= now) return null;
    if (payload.resource !== SCROLLSPRINT_MCP_RESOURCE) return null;
    return payload;
  } catch {
    return null;
  }
}

export function normalizeScope(scope: string | null | undefined) {
  const requested = new Set((scope || "").split(/\s+/).filter(Boolean));
  const allowed = SCROLLSPRINT_OAUTH_SCOPES.filter((item) => requested.has(item));

  // The MCP connection needs both operational scopes. Keep offline_access when requested.
  if (!allowed.includes("higgsfield.read")) allowed.push("higgsfield.read");
  if (!allowed.includes("higgsfield.generate")) allowed.push("higgsfield.generate");
  return allowed.join(" ");
}

export function isAllowedChatGptClient(clientId: string) {
  try {
    const url = new URL(clientId);
    return (
      url.protocol === "https:" &&
      url.hostname === "chatgpt.com" &&
      /^\/oauth\/(?:[^/]+\/)?client\.json$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function isAllowedChatGptRedirect(redirectUri: string) {
  try {
    const url = new URL(redirectUri);
    return (
      url.protocol === "https:" &&
      url.hostname === "chatgpt.com" &&
      (url.pathname === "/connector_platform_oauth_redirect" ||
        /^\/connector\/oauth\/[^/]+$/.test(url.pathname))
    );
  } catch {
    return false;
  }
}

export function verifyOwnerPassword(password: string) {
  return safeEqual(password, oauthSecret());
}

export function createAuthorizationCode(args: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  scope: string;
  resource: string;
}) {
  return sign(
    {
      typ: "authorization_code",
      client_id: args.clientId,
      redirect_uri: args.redirectUri,
      code_challenge: args.codeChallenge,
      scope: normalizeScope(args.scope),
      resource: args.resource,
    },
    300,
  );
}

export function exchangeAuthorizationCode(args: {
  code: string;
  codeVerifier: string;
  clientId: string;
  redirectUri: string;
  resource: string;
}) {
  const payload = verify(args.code, "authorization_code");
  if (!payload) return null;
  if (payload.client_id !== args.clientId) return null;
  if (payload.redirect_uri !== args.redirectUri) return null;
  if (args.resource !== SCROLLSPRINT_MCP_RESOURCE) return null;
  if (!payload.code_challenge) return null;

  const challenge = createHash("sha256").update(args.codeVerifier).digest("base64url");
  if (!safeEqual(challenge, payload.code_challenge)) return null;

  return issueTokenPair(payload.client_id, payload.scope, payload.resource);
}

export function refreshAccessToken(args: {
  refreshToken: string;
  clientId: string;
  resource: string;
}) {
  const payload = verify(args.refreshToken, "refresh_token");
  if (!payload) return null;
  if (payload.client_id !== args.clientId) return null;
  if (args.resource !== SCROLLSPRINT_MCP_RESOURCE) return null;
  return issueTokenPair(payload.client_id, payload.scope, payload.resource);
}

function issueTokenPair(clientId: string, scope: string, resource: string) {
  const normalizedScope = normalizeScope(scope);
  const accessToken = sign(
    {
      typ: "access_token",
      client_id: clientId,
      scope: normalizedScope,
      resource,
      sub: "scrollsprint-owner",
    },
    3600,
  );

  const refreshToken = sign(
    {
      typ: "refresh_token",
      client_id: clientId,
      scope: normalizedScope,
      resource,
      sub: "scrollsprint-owner",
    },
    60 * 60 * 24 * 30,
  );

  return {
    access_token: accessToken,
    token_type: "Bearer" as const,
    expires_in: 3600,
    refresh_token: refreshToken,
    scope: normalizedScope,
  };
}

export function validateMcpBearer(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice(7).trim();
  const payload = verify(token, "access_token");
  if (!payload) return null;
  const scopes = new Set(payload.scope.split(/\s+/).filter(Boolean));
  if (!scopes.has("higgsfield.read") || !scopes.has("higgsfield.generate")) return null;
  return payload;
}
