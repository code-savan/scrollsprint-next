import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const inquirySchema = z.object({
  category: z.enum(["Beauty & grooming", "Wellness", "Home & lifestyle", "Pets", "Something else"]),
  goal: z.enum(["New hooks", "Clearer product demo", "Fresh variations", "Longer explanation"]),
  packageName: z.enum(["Trial Ad", "Test Sprint", "Growth Sprint", "Scale Batch", "Help me choose"]),
  channel: z.literal("email"),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[+0-9 ()-]{7,25}$/),
  email: z.email().max(254),
  productUrl: z.union([z.literal(""), z.url().max(500)]),
  website: z.string().max(200).default(""),
  requestId: z.uuid(),
});
const attempts = new Map<string, { count: number; resetAt: number }>();

function ready() {
  return Boolean(process.env.RESEND_API_KEY && process.env.SCROLLSPRINT_CONTACT_EMAIL && process.env.SCROLLSPRINT_FROM_EMAIL);
}
export function GET() {
  return Response.json({ emailReady: ready() }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try { sameOrigin = Boolean(origin && new URL(origin).host === new URL(request.url).host); }
  catch { sameOrigin = false; }
  if (!sameOrigin) return Response.json({ message: "Please submit this from the ScrollSprint website." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json") || Number(request.headers.get("content-length") || 0) > 8000) {
    return Response.json({ message: "This request is too large or has the wrong format." }, { status: 413 });
  }
  if (!ready()) return Response.json({ message: "Email is being connected. Please choose another contact route." }, { status: 503 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 8000) return Response.json({ message: "This request is too large." }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return Response.json({ message: "Please check your details and try again." }, { status: 400 }); }
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) return Response.json({ message: "Please check your name, phone, email and product link." }, { status: 400 });
  const inquiry = parsed.data;
  if (inquiry.website) return Response.json({ sent: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const previous = attempts.get(ip);
  const next = previous && previous.resetAt > now ? previous : { count: 0, resetAt: now + 15 * 60_000 };
  if (next.count >= 3) return Response.json({ message: "Please wait before sending another request." }, { status: 429 });
  next.count += 1;
  attempts.set(ip, next);
  if (attempts.size > 1000) for (const [key, value] of attempts) if (value.resetAt < now) attempts.delete(key);

  const message = [
    "New ScrollSprint creative inquiry",
    `Name: ${inquiry.name}`, `Phone: ${inquiry.phone}`, `Email: ${inquiry.email}`,
    `Product category: ${inquiry.category}`, `Creative need: ${inquiry.goal}`,
    `Sprint: ${inquiry.packageName}`, `Product page: ${inquiry.productUrl || "Not provided"}`,
    `Reference: ${inquiry.requestId}`,
  ].join("\n");
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const { error } = await resend.emails.send({
      from: process.env.SCROLLSPRINT_FROM_EMAIL!, to: process.env.SCROLLSPRINT_CONTACT_EMAIL!,
      replyTo: inquiry.email, subject: `New ${inquiry.packageName} inquiry | ScrollSprint`, text: message,
    }, { idempotencyKey: `scrollsprint-inquiry/${inquiry.requestId}` });
    if (error) {
      console.error("ScrollSprint contact email failed", error.name);
      return Response.json({ message: "Your request did not send. Please try again." }, { status: 502 });
    }
    return Response.json({ sent: true });
  } catch { return Response.json({ message: "Your request did not send. Please try again." }, { status: 502 }); }
}
