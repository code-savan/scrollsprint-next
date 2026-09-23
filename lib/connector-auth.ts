import { timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function isConnectorAuthorized(request: Request) {
  const expected = process.env.SCROLLSPRINT_CONNECTOR_TOKEN;
  if (!expected) return false;

  const bearer = request.headers.get("authorization");
  const headerToken = request.headers.get("x-scrollsprint-token");
  const supplied = bearer?.startsWith("Bearer ") ? bearer.slice(7) : headerToken;

  return Boolean(supplied && safeEqual(supplied, expected));
}

export function unauthorizedResponse() {
  return Response.json(
    { ok: false, error: "Unauthorized connector request" },
    { status: 401 },
  );
}
