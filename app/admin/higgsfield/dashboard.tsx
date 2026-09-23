"use client";

import { useEffect, useMemo, useState } from "react";

type Estimate = {
  credits?: string | number;
  usd?: string | number;
  [key: string]: unknown;
};

type Job = {
  requestId: string;
  endpoint: string;
  status: string;
  estimatedUsd: number;
  estimatedCredits: number;
  createdAt: string;
  videoUrl?: string;
};

const DEFAULT_ENDPOINT = "bytedance/seedance-2.5/text-to-video";
const DEFAULT_INPUT = `{
  "prompt": "A premium product shot with controlled camera movement, clean studio lighting and realistic materials",
  "duration": 5,
  "resolution": "720p",
  "aspect_ratio": "9:16",
  "output_format": "mp4",
  "generate_audio": false
}`;

const JOBS_KEY = "scrollsprint-higgsfield-jobs-v1";
const BUDGET_KEY = "scrollsprint-higgsfield-budget-v1";

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function extractRequestId(result: Record<string, unknown>) {
  const candidates = [result.request_id, result.requestId, result.id];
  return candidates.find((value) => typeof value === "string") as string | undefined;
}

function extractVideoUrl(result: Record<string, unknown>) {
  const video = result.video;
  if (typeof video === "string") return video;
  if (video && typeof video === "object" && "url" in video) {
    const url = (video as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }
  return undefined;
}

export default function HiggsfieldDashboard() {
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
  const [inputText, setInputText] = useState(DEFAULT_INPUT);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimateSignature, setEstimateSignature] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [budget, setBudget] = useState(15);
  const [loading, setLoading] = useState<"estimate" | "generate" | string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem(JOBS_KEY);
      const storedBudget = localStorage.getItem(BUDGET_KEY);
      if (storedJobs) setJobs(JSON.parse(storedJobs) as Job[]);
      if (storedBudget && Number.isFinite(Number(storedBudget))) setBudget(Number(storedBudget));
    } catch {
      // Local history is optional; ignore malformed browser storage.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, String(budget));
  }, [budget]);

  const projectedSpend = useMemo(
    () =>
      jobs
        .filter((job) => !["failed", "canceled", "cancelled", "moderated"].includes(job.status.toLowerCase()))
        .reduce((sum, job) => sum + job.estimatedUsd, 0),
    [jobs],
  );

  const projectedRemaining = Math.max(0, budget - projectedSpend);
  const currentSignature = `${endpoint}\n${inputText}`;
  const estimateIsCurrent = Boolean(estimate && estimateSignature === currentSignature);

  function parseInput() {
    const parsed = JSON.parse(inputText) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Generation input must be a JSON object.");
    }
    return parsed as Record<string, unknown>;
  }

  async function estimateCost() {
    setError("");
    setNotice("");
    setLoading("estimate");
    try {
      const input = parseInput();
      const response = await fetch("/api/admin/higgsfield/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, input }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        estimate?: Estimate;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.estimate) {
        throw new Error(payload.error || "Estimate failed");
      }
      setEstimate(payload.estimate);
      setEstimateSignature(currentSignature);
      setNotice("Price checked against Higgsfield. No generation was submitted.");
    } catch (err) {
      setEstimate(null);
      setEstimateSignature("");
      setError(err instanceof Error ? err.message : "Estimate failed");
    } finally {
      setLoading(null);
    }
  }

  async function generate() {
    if (!estimateIsCurrent || !estimate) {
      setError("Run a fresh estimate before generating.");
      return;
    }

    const confirmedUsd = numberValue(estimate.usd);
    if (confirmedUsd <= 0) {
      setError("Higgsfield did not return a usable USD estimate. Generation is blocked.");
      return;
    }

    if (confirmedUsd > projectedRemaining) {
      setError(`This $${confirmedUsd.toFixed(2)} request exceeds the $${projectedRemaining.toFixed(2)} projected remaining budget.`);
      return;
    }

    setError("");
    setNotice("");
    setLoading("generate");
    try {
      const input = parseInput();
      const response = await fetch("/api/admin/higgsfield/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, input, confirmedUsd }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        result?: Record<string, unknown>;
        estimate?: Estimate;
        error?: string;
      };

      if (response.status === 409 && payload.estimate) {
        setEstimate(payload.estimate);
        setEstimateSignature(currentSignature);
      }

      if (!response.ok || !payload.ok || !payload.result) {
        throw new Error(payload.error || "Generation submission failed");
      }

      const requestId = extractRequestId(payload.result);
      if (!requestId) throw new Error("Higgsfield accepted the request but returned no request ID.");

      const job: Job = {
        requestId,
        endpoint,
        status: String(payload.result.status || "queued"),
        estimatedUsd: numberValue(payload.estimate?.usd ?? estimate.usd),
        estimatedCredits: numberValue(payload.estimate?.credits ?? estimate.credits),
        createdAt: new Date().toISOString(),
        videoUrl: extractVideoUrl(payload.result),
      };
      setJobs((current) => [job, ...current.filter((item) => item.requestId !== requestId)]);
      setNotice(`Generation submitted: ${requestId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation submission failed");
    } finally {
      setLoading(null);
    }
  }

  async function refreshJob(requestId: string) {
    setError("");
    setLoading(`refresh:${requestId}`);
    try {
      const response = await fetch(`/api/admin/higgsfield/requests/${encodeURIComponent(requestId)}`);
      const payload = (await response.json()) as {
        ok?: boolean;
        result?: Record<string, unknown>;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.result) {
        throw new Error(payload.error || "Status check failed");
      }
      setJobs((current) =>
        current.map((job) =>
          job.requestId === requestId
            ? {
                ...job,
                status: String(payload.result?.status || job.status),
                videoUrl: extractVideoUrl(payload.result || {}) || job.videoUrl,
              }
            : job,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status check failed");
    } finally {
      setLoading(null);
    }
  }

  async function cancelJob(requestId: string) {
    setError("");
    setLoading(`cancel:${requestId}`);
    try {
      const response = await fetch(`/api/admin/higgsfield/requests/${encodeURIComponent(requestId)}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Cancel failed");
      setJobs((current) =>
        current.map((job) => (job.requestId === requestId ? { ...job, status: "canceled" } : job)),
      );
      setNotice(`Cancel request sent for ${requestId}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Planning balance</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-[-0.06em] text-white">${budget.toFixed(2)}</span>
            <span className="pb-1 text-xs text-white/40">manual</span>
          </div>
          <input
            aria-label="Planning balance"
            type="number"
            min="0"
            step="0.01"
            value={budget}
            onChange={(event) => setBudget(Math.max(0, Number(event.target.value) || 0))}
            className="mt-4 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-[#f16a43]"
          />
          <p className="mt-3 text-xs leading-5 text-white/45">Higgsfield does not expose current wallet balance in its public API. Set this from the API Console.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Projected spend</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">${projectedSpend.toFixed(2)}</p>
          <p className="mt-4 text-xs leading-5 text-white/45">Based on submitted jobs tracked in this browser and their preflight estimates.</p>
        </div>

        <div className="rounded-2xl border border-[#f16a43]/40 bg-[#f16a43]/10 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ffb39b]">Projected remaining</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">${projectedRemaining.toFixed(2)}</p>
          <p className="mt-4 text-xs leading-5 text-white/55">Generation is blocked client-side when an estimate exceeds this planning amount.</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff9c7e]">Generation preflight</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Price it before you render it.</h2>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">PAYG</span>
          </div>

          <label className="mt-6 block text-xs font-semibold text-white/65">Model endpoint</label>
          <input
            value={endpoint}
            onChange={(event) => {
              setEndpoint(event.target.value);
              setEstimate(null);
            }}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 font-mono text-xs text-white outline-none focus:border-[#f16a43]"
          />

          <label className="mt-5 block text-xs font-semibold text-white/65">Input JSON</label>
          <textarea
            value={inputText}
            onChange={(event) => {
              setInputText(event.target.value);
              setEstimate(null);
            }}
            rows={14}
            spellCheck={false}
            className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-3 font-mono text-xs leading-5 text-white outline-none focus:border-[#f16a43]"
          />

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={estimateCost}
              disabled={loading !== null}
              className="rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-[#122019] transition hover:bg-white/85 disabled:opacity-50"
            >
              {loading === "estimate" ? "Checking price…" : "Estimate cost"}
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={!estimateIsCurrent || loading !== null}
              className="rounded-lg bg-[#f16a43] px-4 py-2.5 text-xs font-bold text-[#172f26] transition hover:bg-[#ff8d6b] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {loading === "generate"
                ? "Submitting…"
                : estimateIsCurrent
                  ? `Generate — $${numberValue(estimate?.usd).toFixed(3)}`
                  : "Generate — estimate first"}
            </button>
          </div>

          {error ? <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs leading-5 text-red-200">{error}</p> : null}
          {notice ? <p className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs leading-5 text-emerald-200">{notice}</p> : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Current estimate</p>
            {estimateIsCurrent && estimate ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">USD</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">${numberValue(estimate.usd).toFixed(3)}</p>
                </div>
                <div className="rounded-xl bg-black/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">Credits</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">{numberValue(estimate.credits).toFixed(3)}</p>
                </div>
                <pre className="col-span-2 max-h-64 overflow-auto rounded-xl bg-black/30 p-4 text-[11px] leading-5 text-white/60">{JSON.stringify(estimate, null, 2)}</pre>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-white/45">Run an estimate. Higgsfield will validate the model parameters and return the authenticated account price without creating a generation.</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Safety rules</p>
            <ul className="mt-4 space-y-3 text-xs leading-5 text-white/55">
              <li>• No generation is submitted by the estimate button.</li>
              <li>• The server re-estimates immediately before every paid request.</li>
              <li>• If Higgsfield changes the price, the generation is rejected until you approve the new estimate.</li>
              <li>• Keys and connector token remain server-only.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Local job ledger</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Recent PAYG requests</h2>
          </div>
          <button
            type="button"
            onClick={() => setJobs([])}
            className="rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-white/60 hover:bg-white/5"
          >
            Clear local history
          </button>
        </div>

        {jobs.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead className="border-b border-white/10 text-[10px] uppercase tracking-[0.12em] text-white/35">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Request</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Estimate</th>
                  <th className="py-3 pr-4 font-semibold">Created</th>
                  <th className="py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.requestId} className="border-b border-white/[0.07] align-top text-white/70">
                    <td className="py-4 pr-4">
                      <code className="text-[11px] text-white">{job.requestId}</code>
                      <p className="mt-1 max-w-[280px] truncate text-[10px] text-white/35">{job.endpoint}</p>
                    </td>
                    <td className="py-4 pr-4"><span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.08em]">{job.status}</span></td>
                    <td className="py-4 pr-4">${job.estimatedUsd.toFixed(3)}<p className="mt-1 text-[10px] text-white/35">{job.estimatedCredits.toFixed(3)} credits</p></td>
                    <td className="py-4 pr-4 text-[11px] text-white/45">{new Date(job.createdAt).toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {job.videoUrl ? <a href={job.videoUrl} target="_blank" rel="noreferrer" className="rounded-md border border-emerald-400/20 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300">Open output</a> : null}
                        <button type="button" onClick={() => refreshJob(job.requestId)} disabled={loading !== null} className="rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-white/60 hover:bg-white/5 disabled:opacity-40">{loading === `refresh:${job.requestId}` ? "Checking…" : "Refresh"}</button>
                        <button type="button" onClick={() => cancelJob(job.requestId)} disabled={loading !== null || ["completed", "failed", "canceled", "cancelled"].includes(job.status.toLowerCase())} className="rounded-md border border-red-400/15 px-2.5 py-1.5 text-[10px] font-semibold text-red-300 hover:bg-red-400/5 disabled:opacity-30">{loading === `cancel:${job.requestId}` ? "Canceling…" : "Cancel"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-white/35">No jobs submitted through this dashboard yet.</div>
        )}
      </section>
    </div>
  );
}
