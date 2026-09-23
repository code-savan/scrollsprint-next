import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "scrollsprint_admin";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12;

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

function getAdminSecret() {
  const secret = process.env.SCROLLSPRINT_CONNECTOR_TOKEN?.trim();
  if (!secret) throw new Error("SCROLLSPRINT_CONNECTOR_TOKEN is not configured");
  return secret;
}

export function verifyAdminPassword(candidate: string) {
  return safeEqual(candidate, getAdminSecret());
}

export function getAdminSessionValue() {
  return createHash("sha256")
    .update(`scrollsprint-admin:${getAdminSecret()}`)
    .digest("hex");
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const supplied = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!supplied) return false;
  return safeEqual(supplied, getAdminSessionValue());
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: ADMIN_COOKIE_MAX_AGE,
};
