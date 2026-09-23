import {
  createAuthorizationCode,
  isAllowedChatGptClient,
  isAllowedChatGptRedirect,
  normalizeScope,
  SCROLLSPRINT_MCP_RESOURCE,
  SCROLLSPRINT_OAUTH_ISSUER,
  verifyOwnerPassword,
} from "@/lib/scrollsprint-oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function html(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function validate(params: URLSearchParams) {
  const responseType = params.get("response_type") || "";
  const clientId = params.get("client_id") || "";
  const redirectUri = params.get("redirect_uri") || "";
  const codeChallenge = params.get("code_challenge") || "";
  const codeChallengeMethod = params.get("code_challenge_method") || "";
  const state = params.get("state") || "";
  const resource = params.get("resource") || SCROLLSPRINT_MCP_RESOURCE;
  const scope = normalizeScope(params.get("scope"));

  if (responseType !== "code") throw new Error("Only response_type=code is supported");
  if (!isAllowedChatGptClient(clientId)) throw new Error("Unsupported OAuth client");
  if (!isAllowedChatGptRedirect(redirectUri)) throw new Error("Unsupported redirect URI");
  if (!codeChallenge || codeChallengeMethod !== "S256") {
    throw new Error("PKCE with code_challenge_method=S256 is required");
  }
  if (resource !== SCROLLSPRINT_MCP_RESOURCE) throw new Error("Invalid OAuth resource");

  return { clientId, redirectUri, codeChallenge, state, resource, scope };
}

function renderForm(values: ReturnType<typeof validate>, error?: string) {
  const hidden = (name: string, value: string) =>
    `<input type="hidden" name="${name}" value="${escapeHtml(value)}" />`;

  return html(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Authorize ScrollSprint Higgsfield</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0d1512;color:#f7f2e7;font-family:Arial,Helvetica,sans-serif;padding:24px}.card{width:min(460px,100%);border:1px solid #ffffff1f;background:#ffffff0b;border-radius:24px;padding:28px;box-shadow:0 24px 70px #0008}.brand{font-weight:800;letter-spacing:-.04em}.eyebrow{margin-top:32px;color:#f16a43;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}h1{font-size:34px;line-height:1.02;letter-spacing:-.055em;margin:10px 0 12px}p{color:#ffffff8c;font-size:14px;line-height:1.6;margin:0}.scope{margin:22px 0;padding:14px 16px;border:1px solid #ffffff14;border-radius:14px;background:#0003;font-size:12px;color:#ffffffb3}.scope strong{display:block;color:white;margin-bottom:7px}label{display:block;margin-top:22px;font-size:12px;font-weight:700;color:#ffffffb3}input[type=password]{width:100%;margin-top:8px;border:1px solid #ffffff1f;background:#0005;color:white;border-radius:12px;padding:13px 14px;font:inherit;outline:none}input:focus{border-color:#f16a43}.error{margin-top:16px;border:1px solid #ff6b6b55;background:#ff6b6b12;color:#ffc0c0;padding:11px 13px;border-radius:10px;font-size:12px}.button{width:100%;margin-top:18px;border:0;border-radius:12px;padding:14px 16px;background:#f16a43;color:#172f26;font-weight:800;cursor:pointer}.note{margin-top:14px;font-size:11px;color:#ffffff66}.note b{color:#ffffffa8}</style>
</head>
<body>
  <main class="card">
    <div class="brand">ScrollSprint Creative</div>
    <div class="eyebrow">Private OAuth connection</div>
    <h1>Authorize Higgsfield PAYG</h1>
    <p>ChatGPT is requesting permission to use your private ScrollSprint Higgsfield connector.</p>
    <div class="scope"><strong>Requested access</strong>Read generation status and estimates · submit PAYG generations · cancel queued requests</div>
    ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
    <form method="post">
      ${hidden("client_id", values.clientId)}
      ${hidden("redirect_uri", values.redirectUri)}
      ${hidden("code_challenge", values.codeChallenge)}
      ${hidden("code_challenge_method", "S256")}
      ${hidden("state", values.state)}
      ${hidden("resource", values.resource)}
      ${hidden("scope", values.scope)}
      ${hidden("response_type", "code")}
      <label for="password">ScrollSprint connector token</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
      <button class="button" type="submit">Authorize ChatGPT</button>
    </form>
    <p class="note">The token is checked only by <b>scrollsprint.online</b>. It is never sent to Higgsfield or returned to ChatGPT.</p>
  </main>
</body>
</html>`);
}

export async function GET(request: Request) {
  try {
    const values = validate(new URL(request.url).searchParams);
    return renderForm(values);
  } catch (error) {
    return html(`<!doctype html><html><body style="font-family:Arial;padding:40px"><h1>Invalid OAuth request</h1><p>${escapeHtml(error instanceof Error ? error.message : String(error))}</p></body></html>`, 400);
  }
}

export async function POST(request: Request) {
  const form = await request.formData();
  const params = new URLSearchParams();
  for (const key of [
    "response_type",
    "client_id",
    "redirect_uri",
    "code_challenge",
    "code_challenge_method",
    "state",
    "resource",
    "scope",
  ]) {
    params.set(key, String(form.get(key) || ""));
  }

  let values: ReturnType<typeof validate>;
  try {
    values = validate(params);
  } catch (error) {
    return html(`<!doctype html><html><body style="font-family:Arial;padding:40px"><h1>Invalid OAuth request</h1><p>${escapeHtml(error instanceof Error ? error.message : String(error))}</p></body></html>`, 400);
  }

  const password = String(form.get("password") || "");
  if (!verifyOwnerPassword(password)) {
    return renderForm(values, "That connector token is not valid.");
  }

  const code = createAuthorizationCode({
    clientId: values.clientId,
    redirectUri: values.redirectUri,
    codeChallenge: values.codeChallenge,
    scope: values.scope,
    resource: values.resource,
  });

  const redirect = new URL(values.redirectUri);
  redirect.searchParams.set("code", code);
  if (values.state) redirect.searchParams.set("state", values.state);
  redirect.searchParams.set("iss", SCROLLSPRINT_OAUTH_ISSUER);

  return Response.redirect(redirect, 302);
}
