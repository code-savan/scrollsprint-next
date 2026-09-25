# ScrollSprint Creative — Agent Notes

## Stack
- Next.js 16.3 App Router
- TypeScript
- Tailwind CSS 4.3
- Motion for interaction/animation
- Lucide React icons

## Deployment rule
Production is the EXISTING Vercel project currently serving `scrollsprint.online`.
Do not create a replacement Vercel project unless explicitly instructed.
GitHub `main` is the intended production source of truth once Git integration is connected.

## Brand rules
- Brand: ScrollSprint Creative
- Positioning: direct-response ecommerce creative
- Core line: “More ads to test. Less production drag.”
- Do not fabricate client work, ROAS, revenue, testimonials, ad spend, CTR, CPA, or performance outcomes.
- Self-initiated work must be labeled Concept Campaign / Spec Creative.
- AI is production infrastructure, not the headline offer.

## Security
- Never commit `.env.local` or credentials.
- Higgsfield credentials are server-side only in `HF_CREDENTIALS`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
