import { createHiggsfieldClient } from "@higgsfield/client/v2";

const HIGGSFIELD_API_BASE = "https://api.higgsfield.ai";

export type HiggsfieldGenerationResponse = {
  status: string;
  request_id?: string;
  status_url?: string;
  cancel_url?: string;
  video?: { url?: string } | string;
  images?: Array<{ url?: string }>;
  error?: unknown;
  [key: string]: unknown;
};

function getCredentials() {
  const combined = process.env.HF_CREDENTIALS?.trim();
  if (combined) return combined;

  const key = process.env.HF_API_KEY?.trim();
  const secret = process.env.HF_API_SECRET?.trim();

  if (!key || !secret) {
    throw new Error("Higgsfield API credentials are not configured");
  }

  return `${key}:${secret}`;
}

function authHeaders() {
  return {
    Authorization: `Key ${getCredentials()}`,
    "Content-Type": "application/json",
  };
}

export function hasHiggsfieldCredentials() {
  return Boolean(
    process.env.HF_CREDENTIALS?.trim() ||
      (process.env.HF_API_KEY?.trim() && process.env.HF_API_SECRET?.trim()),
  );
}

export function getHiggsfieldClient() {
  return createHiggsfieldClient({
    credentials: getCredentials(),
    baseURL: HIGGSFIELD_API_BASE,
    timeout: 120_000,
    maxRetries: 2,
    retryBackoff: 1_000,
    retryMaxBackoff: 8_000,
  });
}

export async function verifyHiggsfieldAuthentication() {
  const response = await fetch(
    `${HIGGSFIELD_API_BASE}/bytedance/seedance-2.0/text-to-video`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({}),
      cache: "no-store",
    },
  );

  // The payload is intentionally invalid because `prompt` is required.
  // A 400/402/422-style response proves the request passed authentication
  // without creating a billable generation. 401/403 means the key pair failed.
  const authenticated = response.status !== 401 && response.status !== 403;

  return {
    authenticated,
    upstreamStatus: response.status,
    authFailure: response.status === 401 || response.status === 403,
  };
}

export async function submitGeneration(
  endpoint: string,
  input: Record<string, unknown>,
) {
  const client = getHiggsfieldClient();
  const result = await client.subscribe(endpoint, {
    input,
    withPolling: false,
  });

  return result as unknown as HiggsfieldGenerationResponse;
}

export async function getRequestStatus(requestId: string) {
  const response = await fetch(
    `${HIGGSFIELD_API_BASE}/requests/${encodeURIComponent(requestId)}/status`,
    {
      method: "GET",
      headers: authHeaders(),
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Higgsfield status request failed (${response.status}): ${JSON.stringify(payload)}`,
    );
  }

  return payload as HiggsfieldGenerationResponse;
}

export async function cancelRequest(requestId: string) {
  const response = await fetch(
    `${HIGGSFIELD_API_BASE}/requests/${encodeURIComponent(requestId)}/cancel`,
    {
      method: "POST",
      headers: authHeaders(),
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Higgsfield cancel request failed (${response.status}): ${JSON.stringify(payload)}`,
    );
  }

  return payload;
}
