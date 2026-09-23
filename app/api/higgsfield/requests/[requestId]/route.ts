import { isConnectorAuthorized, unauthorizedResponse } from "@/lib/connector-auth";
import { cancelRequest, getRequestStatus } from "@/lib/higgsfield-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  if (!isConnectorAuthorized(request)) return unauthorizedResponse();

  try {
    const { requestId } = await context.params;
    const result = await getRequestStatus(requestId);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Higgsfield error";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isConnectorAuthorized(request)) return unauthorizedResponse();

  try {
    const { requestId } = await context.params;
    const result = await cancelRequest(requestId);
    return Response.json({ ok: true, result }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Higgsfield error";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
