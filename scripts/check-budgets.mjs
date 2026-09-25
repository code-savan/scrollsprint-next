// Performance budget guardrail (Step 13 of the perf audit).
// Run after `next build`: `node scripts/check-budgets.mjs`.
// Fails (exit 1) if any client payload exceeds budget, so the next feature
// PR cannot silently undo the optimization work. Thresholds set ~15-20%
// above the 2026-09-23 post-optimization numbers; CSS raised to 13KB on
// 2026-09-25 after the video slider, custom player, and contact icon system
// landed (dead rules purged at the same time).
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = new URL("..", import.meta.url).pathname;
const BUDGETS = [
  { label: "total client JS (gzip)", paths: [".next/static/chunks"], ext: ".js", maxBytes: 210 * 1024 },
  { label: "total CSS (gzip)", paths: [".next/static/chunks"], ext: ".css", maxBytes: 13 * 1024 },
  { label: "prerendered / HTML (raw)", paths: [".next/server/app/index.html"], ext: null, maxBytes: 80 * 1024 },
];

function collect(dir, ext, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) collect(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

let failed = false;
for (const b of BUDGETS) {
  let files = [];
  for (const p of b.paths) {
    const full = join(ROOT, p);
    try {
      files.push(...(statSync(full).isDirectory() ? collect(full, b.ext) : [full]));
    } catch {
      console.error(`BUDGET ERROR: ${full} not found — run \`next build\` first.`);
      failed = true;
    }
  }
  const bytes = files.reduce(
    (n, f) => n + (b.ext === ".js" || b.ext === ".css" ? gzipSync(readFileSync(f)).length : statSync(f).size),
    0
  );
  const ok = bytes <= b.maxBytes;
  if (!ok) failed = true;
  console.log(`${ok ? "PASS" : "FAIL"} | ${b.label}: ${(bytes / 1024).toFixed(1)}KB / ${(b.maxBytes / 1024).toFixed(0)}KB (${files.length} files)`);
}
process.exit(failed ? 1 : 0);
