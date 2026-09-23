import { isConnectorAuthorized, unauthorizedResponse } from "@/lib/connector-auth";
import { submitGeneration } from "@/lib/higgsfield-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isConnectorAuthorized(request)) return unauthorizedResponse();

  try {
    const body = (await request.json()) as {
      endpoint?: unknown;
      input?: unknown;
    };

    if (typeof body.endpoint !== "string" || !body.endpoint.trim()) {
      return Response.json(
        { ok: false, error: "endpoint must be a non-empty Higgsfield model path" },
        { status: 400 },
      );
    }

    if (!body.input || typeof body.input !== "object" || Array.isArray(body.input)) {
      return Response.json(
        { ok: false, error: "input must be a JSON object" },
        { status: 400 },
      );
    }

    const result = await submitGeneration(
      body.endpoint.trim(),
      body.input as Record<string, unknown>,
    );

    return Response.json({ ok: true, ...result }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Higgsfield error";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
