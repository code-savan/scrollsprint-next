import { hasAdminSession } from "@/lib/admin-auth";
import { estimateGeneration } from "@/lib/higgsfield-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      endpoint?: unknown;
      input?: unknown;
    };

    if (typeof body.endpoint !== "string" || !body.endpoint.trim()) {
      return Response.json({ ok: false, error: "endpoint is required" }, { status: 400 });
    }

    if (!body.input || typeof body.input !== "object" || Array.isArray(body.input)) {
      return Response.json({ ok: false, error: "input must be a JSON object" }, { status: 400 });
    }

    const estimate = await estimateGeneration(
      body.endpoint,
      body.input as Record<string, unknown>,
    );

    return Response.json({ ok: true, estimate });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Estimate failed";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
