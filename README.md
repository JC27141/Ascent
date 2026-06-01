# Ascent Trainer

Ascent Trainer is a Vite React PWA for following a 12-week climbing training plan.

Future agents and maintainers should start with [AGENT_CONTEXT.md](./AGENT_CONTEXT.md). It records the current Git state, architecture, data model, product decisions, run commands, and maintenance protocol.

## Run Locally

```powershell
npm install
npm run dev -- --port 5173
```

Open `http://127.0.0.1:5173/`.

For cloud sync, copy `.env.example` to `.env.local` and fill in the Supabase values:

```powershell
Copy-Item .env.example .env.local
```

The app still runs locally without those values, but it will stay local-only until Supabase is configured.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create or invite the single user account that should access the trainer, and disable public signup if the project will be reachable from the public internet.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local` and to Vercel.

## Build

```powershell
npm run build
```

## Deploy To Phone

Deploy the repo to Vercel as a Vite app. Production should deploy from `main`; branch and pull-request previews provide phone-testable URLs for future iterations. The generated PWA can be installed from the phone browser.

