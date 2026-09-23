import { hasAdminSession } from "@/lib/admin-auth";
import { estimateGeneration, submitGeneration } from "@/lib/higgsfield-api";

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
      confirmedUsd?: unknown;
    };

    if (typeof body.endpoint !== "string" || !body.endpoint.trim()) {
      return Response.json({ ok: false, error: "endpoint is required" }, { status: 400 });
    }

    if (!body.input || typeof body.input !== "object" || Array.isArray(body.input)) {
      return Response.json({ ok: false, error: "input must be a JSON object" }, { status: 400 });
    }

    const input = body.input as Record<string, unknown>;
    const estimate = await estimateGeneration(body.endpoint, input);
    const currentUsd = Number(estimate.usd);
    const confirmedUsd = Number(body.confirmedUsd);

    if (!Number.isFinite(currentUsd) || !Number.isFinite(confirmedUsd)) {
      return Response.json(
        { ok: false, error: "A valid preflight cost confirmation is required", estimate },
        { status: 409 },
      );
    }

    if (Math.abs(currentUsd - confirmedUsd) > 0.005) {
      return Response.json(
        {
          ok: false,
          error: "Higgsfield price changed. Review the new estimate before generating.",
          estimate,
        },
        { status: 409 },
      );
    }

    const result = await submitGeneration(body.endpoint, input);
    return Response.json({ ok: true, estimate, result }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
