import { hasHiggsfieldCredentials } from "@/lib/higgsfield-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    service: "scrollsprint-higgsfield-payg-connector",
    apiBase: "https://api.higgsfield.ai",
    credentialsConfigured: hasHiggsfieldCredentials(),
    connectorTokenConfigured: Boolean(process.env.SCROLLSPRINT_CONNECTOR_TOKEN),
  });
}
