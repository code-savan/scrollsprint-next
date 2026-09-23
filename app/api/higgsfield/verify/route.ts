import { verifyHiggsfieldAuthentication } from "@/lib/higgsfield-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await verifyHiggsfieldAuthentication();
    return Response.json({
      ok: true,
      ...result,
      note: "This probe submits an intentionally invalid payload, so no generation job is created and no credits are spent.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Higgsfield verification error";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
