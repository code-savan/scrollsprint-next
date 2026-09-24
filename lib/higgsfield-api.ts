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

export type HiggsfieldEstimateResponse = {
  credits?: string | number;
  usd?: string | number;
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

function normalizeEndpoint(endpoint: string) {
  return endpoint.trim().replace(/^\/+|\/+$/g, "");
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

type DerivedTokenPrice = {
  usd: number;
  videoTokens: number;
  width: number;
  height: number;
  fps: number;
  ratePerThousandTokens: number;
  outputs: number;
};

function roundUpToMultiple(value: number, multiple: number) {
  return Math.ceil(value / multiple) * multiple;
}

export function deriveTokenMeteredUsd(
  estimate: HiggsfieldEstimateResponse,
  input: Record<string, unknown>,
): DerivedTokenPrice | null {
  const description =
    typeof estimate.pricing_description === "string"
      ? estimate.pricing_description
      : "";

  if (
    !description.includes("Billable video tokens") ||
    !/(?:Per|each)\s+1,?000\s+video\s+tokens/i.test(description)
  ) {
    return null;
  }

  const duration = Number(input.duration);
  // Referenced videos add input seconds to the billable total. Without their
  // verified durations, refuse to derive a price rather than underestimating.
  if (input.video_url || (Array.isArray(input.video_urls) && input.video_urls.length)) {
    return null;
  }
  const resolution = String(input.resolution ?? "").toLowerCase();
  const aspectRatio = String(input.aspect_ratio ?? "");
  const ratioMatch = aspectRatio.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  const resolutionMatch = resolution.match(/^(\d+)p$/);

  if (
    !Number.isFinite(duration) ||
    duration <= 0 ||
    !ratioMatch ||
    (!resolutionMatch && resolution !== "4k")
  ) {
    return null;
  }

  const ratioWidth = Number(ratioMatch[1]);
  const ratioHeight = Number(ratioMatch[2]);
  if (ratioWidth <= 0 || ratioHeight <= 0) return null;

  const shortEdge =
    resolution === "4k" ? 2160 : Number(resolutionMatch?.[1]);
  if (!Number.isFinite(shortEdge) || shortEdge <= 0) return null;

  const ratio = ratioWidth / ratioHeight;
  const width =
    ratio >= 1 ? roundUpToMultiple(shortEdge * ratio, 16) : shortEdge;
  const height =
    ratio >= 1 ? shortEdge : roundUpToMultiple(shortEdge / ratio, 16);

  const fpsMatch = description.match(/(\d+(?:\.\d+)?)\s*fps/i);
  const fps = Number(fpsMatch?.[1]);
  if (!Number.isFinite(fps) || fps <= 0) return null;

  const ratePattern =
    resolution === "4k"
      ? /4K[^$]{0,100}\$(\d+(?:\.\d+)?)/i
      : /480p\s*(?:\/|or)\s*720p(?:\s*(?:\/|or)\s*1080p)?[^$]{0,100}\$(\d+(?:\.\d+)?)/i;
  const rateMatch = description.match(ratePattern);
  const ratePerThousandTokens = Number(rateMatch?.[1]);
  if (!Number.isFinite(ratePerThousandTokens) || ratePerThousandTokens <= 0) {
    return null;
  }

  const requestedOutputs = Number(input.count ?? input.num_outputs ?? 1);
  const outputs =
    Number.isFinite(requestedOutputs) && requestedOutputs > 0
      ? Math.ceil(requestedOutputs)
      : 1;
  const videoTokens =
    Math.ceil((duration * width * height * fps) / 1024) * outputs;
  const usd = Math.ceil(
    ((videoTokens / 1000) * ratePerThousandTokens) * 1_000_000,
  ) / 1_000_000;

  return {
    usd,
    videoTokens,
    width,
    height,
    fps,
    ratePerThousandTokens,
    outputs,
  };
}

export async function estimateGeneration(
  endpoint: string,
  input: Record<string, unknown>,
) {
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  if (!normalizedEndpoint) throw new Error("A Higgsfield model endpoint is required");

  const response = await fetch(
    `${HIGGSFIELD_API_BASE}/estimate/${normalizedEndpoint}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(input),
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Higgsfield estimate failed (${response.status}): ${JSON.stringify(payload)}`,
    );
  }

  const estimate = payload as HiggsfieldEstimateResponse;
  const existingUsd = Number(estimate.usd);
  if (Number.isFinite(existingUsd)) return estimate;

  const derived = deriveTokenMeteredUsd(estimate, input);
  if (!derived) return estimate;

  return {
    ...estimate,
    usd: derived.usd,
    usd_source: "derived_from_higgsfield_pricing_description",
    pricing_calculation: derived,
  } as HiggsfieldEstimateResponse;
}

export async function submitGeneration(
  endpoint: string,
  input: Record<string, unknown>,
) {
  const client = getHiggsfieldClient();
  const result = await client.subscribe(normalizeEndpoint(endpoint), {
    input,
    withPolling: false,
  });

  return result as unknown as HiggsfieldGenerationResponse;
}

export async function getRequestStatus(requestId: string, statusUrl?: string) {
  let url = `${HIGGSFIELD_API_BASE}/requests/${encodeURIComponent(requestId)}/status`;
  if (statusUrl) {
    const supplied = new URL(statusUrl);
    if (
      supplied.protocol !== "https:" ||
      !["api.higgsfield.ai", "platform.higgsfield.ai"].includes(supplied.hostname) ||
      supplied.pathname !== `/requests/${encodeURIComponent(requestId)}/status` ||
      supplied.search ||
      supplied.hash
    ) {
      throw new Error("Invalid Higgsfield status URL for this request");
    }
    url = supplied.toString();
  }
  const response = await fetch(
    url,
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
