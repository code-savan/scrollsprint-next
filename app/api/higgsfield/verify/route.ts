import { verifyHiggsfieldAuthentication } from "@/lib/higgsfield-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function inspectAscii(name: string, value: string | undefined) {
  if (!value) return { name, present: false, ascii: null, invalidCharacters: [] as Array<{ index: number; codePoint: number }> };

  const invalidCharacters: Array<{ index: number; codePoint: number }> = [];
  [...value].forEach((char, index) => {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint > 127) invalidCharacters.push({ index, codePoint });
  });

  return {
    name,
    present: true,
    ascii: invalidCharacters.length === 0,
    invalidCharacters,
  };
}

export async function GET() {
  const diagnostics = [
    inspectAscii("HF_API_KEY", process.env.HF_API_KEY),
    inspectAscii("HF_API_SECRET", process.env.HF_API_SECRET),
    inspectAscii("HF_CREDENTIALS", process.env.HF_CREDENTIALS),
  ];

  const malformed = diagnostics.filter((item) => item.present && item.ascii === false);
  if (malformed.length > 0) {
    return Response.json({
      ok: false,
      authenticated: false,
      malformedEnvironmentVariables: malformed,
      note: "One or more Higgsfield credential env vars contain non-ASCII characters, usually copied masking bullets. Replace them with the original raw API ID/secret values.",
    }, { status: 422 });
  }

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
