# ScrollSprint Creative

Production website for **ScrollSprint Creative**.

## Stack
- Next.js 16.3.6 App Router
- TypeScript
- Tailwind CSS 4.3
- Motion
- Lucide React

## Local development
```bash
npm install
npm run dev
```

## Higgsfield / Seedance 2.5
The server-side SDK example is in `scripts/seedance-test.ts`.

1. Copy `.env.example` to `.env.local`.
2. Enter `HF_CREDENTIALS` locally in `KEY_ID:KEY_SECRET` format.
3. Never commit the env file.
4. Run `npm run higgsfield:test`.

The test makes a billable 5-second 720p Seedance 2.5 text-to-video request and prints the video URL only after a completed result. Failed, canceled, moderated, or URL-less results exit non-zero.

## Production deployment
Preserve the existing Vercel project serving `scrollsprint.online`. Once the GitHub repository is connected to that Vercel project, `main` should remain the production branch.
