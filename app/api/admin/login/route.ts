import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  getAdminSessionValue,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const redirectUrl = new URL("/admin/higgsfield", request.url);

  if (!password || !verifyAdminPassword(password)) {
    redirectUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const response = NextResponse.redirect(redirectUrl, { status: 303 });
  response.cookies.set(ADMIN_COOKIE_NAME, getAdminSessionValue(), adminCookieOptions);
  return response;
}
