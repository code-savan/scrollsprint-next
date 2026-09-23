import { hasAdminSession } from "@/lib/admin-auth";
import { cancelRequest, getRequestStatus } from "@/lib/higgsfield-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { requestId } = await context.params;
    const result = await getRequestStatus(requestId);
    return Response.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Status check failed";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { requestId } = await context.params;
    const result = await cancelRequest(requestId);
    return Response.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cancel failed";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
