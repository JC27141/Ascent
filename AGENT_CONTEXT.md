# Ascent Trainer Agent Context

## Project Snapshot

Ascent Trainer is an installable React PWA for following a 12-week climbing training plan. It is built for personal training use, with emphasis on consistency, movement quality, injury avoidance, and plan adherence.

The app came from a Claude single-file artifact and has been migrated into a Vite React PWA while preserving the original training flow.

## Git State

- Repo path: `C:/Users/jeffc/Ascent`
- Baseline branch: `master`
- Active implementation branch: `codex/pwa-hardening`
- Remote status: no Git remote is configured at the time this document was written.

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
- App icon: `public/icon.svg`
- Production build output: `dist/`

The app is still mostly single-file. That is acceptable for the current small codebase, but future substantial work may benefit from extracting storage, schedule, trainer data, and UI panels into separate modules.

## Data And Persistence

Persistence uses browser `localStorage`.

- Current storage key: `ascent_app_data_v1`
- Current `schemaVersion`: `1`
- Stored fields:
  - `plan`
  - `logs`
  - `metrics`
  - `sends`
  - `schedule`
  - `settings`
- Schedule shape:
  - `startDate`
  - `preferredSessionDays`
  - `travelBlocks`
- Session logs retain the existing session fields and may include `volumeByGrade`.
- Legacy migration reads these old keys if the new app data key does not exist:
  - `ct_plan`
  - `ct_logs`
  - `ct_metrics`
  - `ct_sends`

Backup/import behavior:

- Full export includes plan, logs, metrics, sends, schedule, settings, schema version, and export timestamp.
- Legacy plan-only JSON imports are supported and should not erase logs, metrics, sends, schedule, or settings.
- Import/migration must not overwrite user training history unless validation succeeds.
- Personal exported backup JSON files are ignored by `.gitignore` and should not be committed unless the user explicitly asks.

If `schemaVersion` changes, update this document in the same commit or an adjacent docs commit.

## Training/Product Rules

- The training philosophy is movement-first and injury-aware.
- Pain flags are advisory only. The app should surface guidance such as going lighter or considering a deload, but it should not silently rewrite the plan.
- Travel/deload blocks are configurable and currently advisory.
- Per-session climbing volume feeds the global pyramid.
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

Verification checklist:

- `npm run build` passes.
- App opens at the local dev URL.
- Session logs persist after refresh.
- Full backup export contains all app data.
- Legacy plan-only import preserves history.
- Per-session volume updates the global pyramid without double-counting edited sessions.
- Production build generates `dist/manifest.webmanifest` and `dist/sw.js`.

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

- No Git remote is configured yet.
- No automated tests exist yet.
- Persistence is `localStorage`, not IndexedDB.
- The app is still mostly single-file.
- Travel blocks currently advise but do not automatically reschedule sessions.
- Backup JSON is manual export/import, not automatic cloud sync.

