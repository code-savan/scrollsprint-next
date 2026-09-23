import type { Metadata } from "next";
import { hasAdminSession } from "@/lib/admin-auth";
import { hasHiggsfieldCredentials, verifyHiggsfieldAuthentication } from "@/lib/higgsfield-api";
import HiggsfieldDashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Higgsfield PAYG Admin — ScrollSprint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HiggsfieldAdminPage({ searchParams }: PageProps) {
  const isAdmin = await hasAdminSession();
  const params = await searchParams;

  if (!isAdmin) {
    const invalid = params.error === "invalid";
    return (
      <main className="min-h-screen bg-[#0d1512] px-5 py-16 text-white md:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
            <a href="/" className="text-sm font-bold tracking-[-0.04em] text-white">ScrollSprint Creative</a>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f16a43]">Private operations</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">Higgsfield PAYG Admin</h1>
            <p className="mt-4 text-sm leading-6 text-white/50">Use the private ScrollSprint connector token you added in Vercel. The token is checked server-side and is never stored in browser JavaScript.</p>

            <form action="/api/admin/login" method="post" className="mt-7">
              <label htmlFor="password" className="text-xs font-semibold text-white/65">Admin token</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-[#f16a43]"
                placeholder="SCROLLSPRINT_CONNECTOR_TOKEN"
              />
              {invalid ? <p className="mt-3 text-xs text-red-300">That token was not accepted.</p> : null}
              <button type="submit" className="mt-5 w-full rounded-xl bg-[#f16a43] px-4 py-3 text-sm font-bold text-[#172f26] transition hover:bg-[#ff8d6b]">Open admin</button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  let authenticated = false;
  let upstreamStatus: number | null = null;
  let authMessage = "Not checked";

  try {
    const result = await verifyHiggsfieldAuthentication();
    authenticated = result.authenticated;
    upstreamStatus = result.upstreamStatus;
    authMessage = authenticated ? "Authenticated to Higgsfield PAYG API" : "Higgsfield rejected the API credentials";
  } catch (error) {
    authMessage = error instanceof Error ? error.message : "Higgsfield verification failed";
  }

  return (
    <main className="min-h-screen bg-[#0d1512] px-4 py-6 text-white md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
          <div>
            <a href="/" className="text-sm font-bold tracking-[-0.04em] text-white">ScrollSprint Creative</a>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f16a43]">Operations console</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">Higgsfield PAYG</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">Cost-check, submit and inspect video generation requests without exposing the Higgsfield API credentials to the browser.</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 hover:bg-white/5">Log out</button>
          </form>
        </header>

        <section className="my-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Vercel credentials</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
              <span className={`h-2 w-2 rounded-full ${hasHiggsfieldCredentials() ? "bg-emerald-400" : "bg-red-400"}`} />
              {hasHiggsfieldCredentials() ? "Configured" : "Missing"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Higgsfield authentication</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
              <span className={`h-2 w-2 rounded-full ${authenticated ? "bg-emerald-400" : "bg-red-400"}`} />
              {authenticated ? "Connected" : "Not connected"}
            </p>
            <p className="mt-1 text-[10px] text-white/35">{authMessage}{upstreamStatus ? ` · upstream ${upstreamStatus}` : ""}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Wallet visibility</p>
            <p className="mt-2 text-sm font-semibold text-amber-200">Console-only</p>
            <p className="mt-1 text-[10px] leading-4 text-white/35">The public API documents per-request estimates, not a current balance endpoint.</p>
          </div>
        </section>

        <HiggsfieldDashboard />

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-5 text-[10px] text-white/30">
          <span>ScrollSprint private production infrastructure</span>
          <a href="https://console.higgsfield.ai" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white">Open Higgsfield API Console ↗</a>
        </footer>
      </div>
    </main>
  );
}
