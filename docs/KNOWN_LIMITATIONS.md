# Known Limitations — Release 0.1

Honest accounting of what this build does not do, so nobody mistakes a
vertical slice for the full product.

## Scope limitations (by design — see docs/PRODUCT_DECISIONS.md)

- **One experience, five episodes.** Only the Digital Project Officer
  placement is built, and only the episodes needed for this vertical slice
  (induction, briefing, requirements meeting, RAID log, testing/privacy
  incident). PRD episodes 4, 5, 7, 8 and the full episode 10 (stakeholder
  map, delivery plan, status report, change-impact summary, full
  handover/presentation) are not built.
- **No public verification links.** `verification_links` exists in the
  schema with RLS, but no route issues, serves or revokes a public link.
  The portfolio is private-preview only, as the build prompt specifies.
- **No payments, cohorts or notifications.** FR-21–24 in the PRD are
  explicitly "Should"/"Later" and are not in this build.
- **Minimal admin console.** `/admin/review` is a flagged-assessment queue
  gated by `appRole`, not a content-management UI. Scenario content is
  edited by changing the TypeScript files in `lib/scenario/`, not through
  the app.

## Technical limitations

- **Demo-mode data store is not multi-instance-safe.** It's a single JSON
  file guarded by an in-process write queue — correct for local
  development or a single-instance demo deployment, not for a
  horizontally-scaled production deployment. Configure Supabase for that.
- **Demo-mode auth is intentionally simple.** Registration doesn't verify
  email ownership (no email is actually sent), matching the "no setup
  required" demo-mode promise. Passwords are hashed with scrypt, but this
  is not a substitute for Supabase Auth's full feature set (password
  reset flows, magic links, MFA) — those exist once Supabase is
  configured, not in demo mode.
- **No way to promote a demo user to `facilitator`/`admin` through the
  UI.** In demo mode, edit the `appRole` field for that user directly in
  `.demo-data/db.json`. In Supabase mode, update the `profiles.app_role`
  column directly (or add an admin UI in Release 0.2).
- **`lib/supabase/database.types.ts` is a placeholder `any` type**, not
  generated from a real project (`supabase gen types typescript`), since no
  live Supabase project exists in this build environment. The Supabase
  repo implementation (`lib/data/supabase/supabaseRepo.ts`) is written and
  type-checks against the app's own domain types, but has not been
  exercised against a live Supabase project in this environment — it
  should be smoke-tested against a real project before a production launch.
- **`npm audit` flags moderate/high/critical advisories in `vitest`'s
  transitive `esbuild`/`vite` dependencies.** These affect the *local Vite
  dev server used only while running tests*, not any code shipped to
  production, and not `next dev`/`next build` (which uses Turbopack, not
  Vite). Bumping `vitest` to a version with a patched `esbuild` currently
  requires accepting a peer-dependency conflict in this environment;
  worth revisiting when the ecosystem catches up.
- **The demo AI provider is rule-based, not a language model.** It scores
  reliably against the specific scenario (see `lib/assessment/demoScorer.ts`)
  but won't handle creative or unexpected phrasing as gracefully as live
  Claude would. It exists so the whole product is testable and
  demonstrable without any external service.

## Content and assessment limitations

- The demo scorer's heuristics are necessarily narrower than a real
  language model's judgement — e.g. it detects the presence of key
  concepts (naming James Wilson, mentioning reproduction rate) rather than
  evaluating open-ended writing quality. The live Anthropic provider
  (`lib/ai/anthropicProvider.ts`) is grounded in the same rubric and
  facts, and should be the primary mode for anything beyond local
  development or demonstration.
- Competency coverage in this vertical slice is partial: `planning_and_coordination`
  and `adaptability_and_learning` have no work product that generates
  evidence for them yet (both would come from episodes not built in 0.1 —
  see the Release 0.2 backlog). The Experience Score page shows these
  honestly as "Not yet assessed" rather than hiding them or faking a score.
- A qualified Project Management practitioner has not reviewed the rubrics
  or scenario content — the PRD explicitly calls for this before any real
  pilot (§20), and it remains an open, unresolved decision (see
  docs/PRODUCT_DECISIONS.md §5).

## Accessibility

- Automated WCAG 2.2 AA checks (axe-core, via `tests/e2e/accessibility.spec.ts`)
  pass with no serious/critical violations on the pages tested (landing,
  registration, dashboard). This is not a substitute for manual testing
  with a screen reader and full keyboard-only walkthrough of every screen,
  which has not been performed in this build.
- Meeting transcripts and long-form content are static text; no live
  captioning/audio equivalent exists (the PRD's "media/transcripts"
  language is satisfied via transcript only, no audio/video content is
  produced in Release 0.1).
