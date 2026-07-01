# Ascent Trainer Agent Context

## Project Snapshot

Ascent Trainer is an installable React PWA for following a 12-week climbing training plan. It is built for personal training use, with emphasis on consistency, movement quality, injury avoidance, and plan adherence.

The app came from a Claude single-file artifact and has been migrated into a Vite React PWA while preserving the original training flow.

## Git State

- Primary repo URL: `https://github.com/JC27141/Ascent`
- Known local checkout paths:
  - `C:/Users/jeffc/Documents/Ascent` - Codex desktop chats may open here by default.
  - `C:/Users/jeffc/Ascent` - original working copy used during the first implementation.
- Before starting work, run `git status --short --branch` and `git remote -v` in the current workspace to confirm it is on `origin/main` or an intended feature branch.
- Default branch: `main`
- Baseline branch: `master`
- Previous implementation branch: `codex/pwa-hardening`
- Remote: `origin` -> `https://github.com/JC27141/Ascent.git`
- GitHub visibility: public
- GitHub default branch: `main`
- Local default branch: `main`
- Local baseline branch: `master`
- Historical implementation branch: `codex/pwa-hardening`
- Vercel project: `flurt-s-projects/ascent-trainer`
- Vercel project ID: `prj_JyKj4QBX4SXcXRjVfrGMO1rz95p6`
- Vercel Git connection: `https://github.com/JC27141/Ascent`
- Vercel production URL: `https://ascent-trainer.vercel.app`
- Vercel env status: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured for Production and Development. Preview env vars still need a non-production Git branch or dashboard setup.

New feature branches should be created from `main`.

Current commit history:

- `5638b7f` - `Baseline climbing tracker artifacts`
  - Untouched baseline containing the original JSX artifact and workbook.
- `8d990e1` - `Scaffold Vite PWA app`
  - Vite React shell, PWA config, app icon, and migrated `src/App.jsx`.
- `649df21` - `Add durable trainer data and scheduling`
  - Versioned local storage, backup/import, scheduling, per-session volume, and pain guidance.

Source should be protected through Git. Personal training data should be protected through the app's export/import backup JSON, not by committing live backup files.

## Source Of Truth

- Original Claude artifact: `ascent-trainer-v3_1.jsx`
- Original tracker workbook: `three-month-climbing-tracker.xlsx`
- Current app entry: `src/App.jsx`
- React mount entry: `src/main.jsx`
- PWA/build config: `vite.config.js`
- Package manifest: `package.json`

The original files are retained as baseline/reference artifacts. New app work should happen in the Vite app structure.

## Architecture

- Framework: Vite + React
- Main UI: currently concentrated in `src/App.jsx`
- Icons: `lucide-react`
- PWA tooling: `vite-plugin-pwa`
- Cloud sync: Supabase Auth + Postgres through `@supabase/supabase-js`, with Supabase Realtime for instant cross-device updates
- Deployment target: Vercel static Vite deployment with branch/PR preview URLs
- App icon: `public/icon.svg`
- Production build output: `dist/`

The app is still mostly single-file. That is acceptable for the current small codebase, but future substantial work may benefit from extracting storage, schedule, trainer data, and UI panels into separate modules.

## Data And Persistence

Persistence uses browser `localStorage` as the offline cache and Supabase as the authenticated cloud source when configured.

- Current storage key: `ascent_app_data_v1`
- Current `schemaVersion`: `3`
- Stored fields:
  - `updatedAt`
  - `activeCycle`
  - `completedCycles`
  - `sends`
  - `settings`
- Active and completed cycle fields:
  - `cycleId`
  - `cycleNumber`
  - `planTemplateId`
  - `plan`
  - `logs`
  - `metrics`
  - `schedule`
  - `startedAt`
  - `completedAt`
  - `summary` on completed cycles
- Schedule shape:
  - `startDate`
  - `preferredSessionDays`
  - `travelBlocks` (shown as Blockers in the calendar UI)
  - `sessionOverrides` keyed by `week-sessionId` for manually shifted sessions
- Session logs retain the existing session fields and may include `volumeByGrade` and `attemptsByGrade`.
- Supabase table: `public.app_state`
  - `user_id uuid primary key`
  - `data jsonb not null`
  - `schema_version int not null`
  - `updated_at timestamptz not null`
- Row Level Security must stay enabled. Authenticated users may only select, insert, and update rows where `auth.uid() = user_id`.
- On sign-in, the app compares local and cloud `updatedAt` values and keeps the newest app payload.
- Local changes save immediately to `localStorage` and debounce an upsert to Supabase when online.
- Offline changes remain usable locally and sync on the browser `online` event.
- Live cross-device sync: the app subscribes to Supabase Realtime `postgres_changes` on its own `app_state` row. When another signed-in device writes a newer payload, the change is applied immediately without a reload or reconnect. The realtime handler reuses the same `updatedAt` last-write-wins guard, so a device ignores its own echoed write and any payload not strictly newer than local.
- Realtime requires `app_state` to be in the `supabase_realtime` publication with `replica identity full`; `supabase/schema.sql` configures this idempotently. RLS still applies to realtime, so a user only ever receives changes to their own row.
- The app offers sign-in only. Create or invite the single allowed account in Supabase and disable public signup for a private deployment.
- Legacy migration reads these old keys if the new app data key does not exist:
  - `ct_plan`
  - `ct_logs`
  - `ct_metrics`
  - `ct_sends`

Backup/import behavior:

- Full export includes plan, logs, metrics, sends, schedule, settings, schema version, `updatedAt`, and export timestamp.
- Legacy plan-only JSON imports are supported and should not erase logs, metrics, sends, schedule, or settings.
- Import/migration must not overwrite user training history unless validation succeeds.
- Personal exported backup JSON files are ignored by `.gitignore` and should not be committed unless the user explicitly asks.

Results export behavior:

- Manage plan offers on-demand results CSV and JSON downloads separate from full backup/import.
- Results exports include completed cycles plus the current active cycle.
- Results CSV flattens workout logs and weekly metric checkpoints with cycle, week, session, date, status, RPE, sends by grade, attempts by grade, pain flags/text, sleep, pull-ups, flash grade, project grade, and notes.
- Results JSON preserves normalized cycle result data: plan metadata, schedule context, logs, metrics, summaries, and `exportedAt`.
- Results export is download-only and must not change `updatedAt`, local storage, or Supabase sync state.
- Generated `ascent-results*.csv` and `ascent-results*.json` files are ignored by `.gitignore`.

If `schemaVersion` changes, update this document in the same commit or an adjacent docs commit.

## Training/Product Rules

- The training philosophy is movement-first and injury-aware.
- Pain flags are advisory only. The app should surface guidance such as going lighter or considering a deload, but it should not silently rewrite the plan.
- Travel/deload blocks are configurable as calendar Blockers. They warn on conflicts and prompt manual shifting, but they do not automatically reschedule sessions.
- Per-session climbing volume feeds the global pyramid and calendar effort intensity.
- Failed/project attempts are logged by grade in `attemptsByGrade`; they appear as separate projecting markers and do not contribute to effort intensity.
- Calendar effort uses sends and RPE for logged climbing days, RPE for support work, and a simple planned estimate for future days.
- Manual pyramid adjustment remains available for corrections.
- Export/import protects user training history.
- Git protects app source and default artifacts.

Preserve the plan's intent: consistency across the full 12 weeks matters more than maximizing any single session.

## Run And Verify

Install dependencies:

```powershell
npm install
```

Run the local dev server:

```powershell
npm run dev -- --port 5173
```

Build production output:

```powershell
npm run build
```

Preview production output if needed:

```powershell
npm run preview
```

Expected local dev URL:

```text
http://127.0.0.1:5173/
```

Cloud sync environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Deployment:

- Vercel should deploy production from `main`.
- Vercel preview deploys should be used for branch/PR phone testing.
- Add the same Supabase environment variables to Vercel production and preview environments.
- Run `supabase/schema.sql` in the Supabase project before using the deployed app.
- Local `.vercel/` link metadata is ignored by Git.
- Latest manual production deploy was aliased to `https://ascent-trainer.vercel.app`.

Verification checklist:

- `npm run build` passes.
- App opens at the local dev URL.
- Session logs persist after refresh.
- Calendar month and selected-day agenda render scheduled workouts, blockers, conflicts, shifted sessions, effort intensity, and projecting markers.
- Blockers can be added, edited, and deleted without editing raw JSON.
- Conflicted unlogged sessions can be shifted manually and reset to the original plan date.
- Full backup export contains all app data.
- Legacy plan-only import preserves history.
- Per-session volume updates the global pyramid without double-counting edited sessions, and failed attempts persist separately by grade.
- Production build generates `dist/manifest.webmanifest` and `dist/sw.js`.
- Signed-out users see the login screen when Supabase environment variables are present.
- Signed-in users can sync data between desktop and phone.
- A change saved on one signed-in device appears on another open signed-in device within a second or two, with no reload (requires the realtime publication step in `supabase/schema.sql`).
- Offline edits persist locally and sync after reconnect.
- Supabase RLS blocks access to any other user's `app_state` row.
- Manage plan results CSV and JSON exports include active and completed cycle results without changing saved app data.

## Maintenance Protocol

Update this document whenever any of these change:

- Branch strategy, remote URL, deployment target, or release process.
- Storage schema, backup/import format, or migration behavior.
- PWA tooling, build commands, or package manager assumptions.
- Major product behavior such as scheduling, pain guidance, volume tracking, metrics, or plan structure.
- Known limitations are fixed or new ones are discovered.

Every meaningful feature branch should end with a documentation review:

- Confirm commands still work.
- Update data model notes if schema changed.
- Add new testing expectations.
- Record new handoff warnings.
- Confirm personal backup handling is still documented correctly.

If a remote is added, document:

- Remote name and URL.
- Default branch.
- Push and PR workflow.
- Whether `master` remains the baseline branch or is renamed.

## Known Limitations

- Git remote is configured and `main` contains the current PWA app.
- No automated tests exist yet.
- Persistence is `localStorage`, not IndexedDB.
- The app is still mostly single-file.
- Blockers currently advise and offer manual shift prompts; they do not automatically reschedule sessions.
- Cloud conflict resolution is app-level last-write-wins by `updatedAt`; per-record merge can be added later if needed.
