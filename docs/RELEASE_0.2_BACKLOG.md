# Recommended Release 0.2 Backlog

Derived from the PRD's own release sequence (§4.3) and build backlog
(§19), scoped down to what follows naturally from this 0.1 vertical slice.
Ordered roughly by dependency, not strictly by priority.

## 1. Remaining episode content (PRD §7)

- **Episode 4 — Stakeholder coordination:** stakeholder map, communication
  plan work product.
- **Episode 5 — Planning and dependencies:** delivery plan, milestone
  tracker, agenda.
- **Episode 7 — Development progress:** status report, updated plan and
  actions — gives evidence for `planning_and_coordination`.
- **Episode 8 — Feature request:** change-impact summary for the
  video-consultation request mentioned in the PRD.
- **Episode 10 — Review and handover:** project summary, lessons learned,
  handover note, presentation — gives evidence for `adaptability_and_learning`
  and closes the two competency gaps flagged in Known Limitations.

Each should reuse the existing `Task`/`Meeting`/`Communication` model — no
new data-model work needed, just content in `lib/scenario/` plus new
routes following the existing `app/tasks/[code]` pattern.

## 2. Public verification links (PRD §13.2, FR-18)

- Build the `/verify/[token]` public route reading `verification_links`.
- Learner-facing UI to issue, view access log, and revoke links (S17 in
  the PRD's screen inventory).
- Verification view must answer the PRD's four employer questions and
  respect the "Employer can/cannot see" split in PRD §13.2 — this needs a
  second RLS policy path (anon key + valid unexpired token) that Release
  0.1 deliberately did not add.

## 3. Full admin/content console (PRD S18, FR-20)

- Participant overview and enrollment management.
- A content-authoring UI for scenario text (currently TypeScript files).
- Rubric management UI instead of hand-edited `lib/assessment/rubric.ts`.

## 4. Notifications and reflection tooling (FR-21, FR-22)

- Email/in-app reminders for new messages, deadlines, returned feedback.
- Evidence-based STAR and CV draft generation from completed submissions
  (an AI-provider call, following the same grounded/no-invented-facts
  pattern as assessment).

## 5. Payments and cohort operations (FR-23, FR-24)

- Founding price, scholarship codes, receipts, enrollment caps.
- Organisational cohorts and branded invitations.

## 6. Hardening for a real pilot

- Generate real Supabase types (`supabase gen types typescript`) and
  remove the `any`-typed placeholder in `lib/supabase/database.types.ts`.
- Smoke-test `lib/data/supabase/supabaseRepo.ts` against a live project;
  add integration tests that run against a local Supabase instance (e.g.
  via the Supabase CLI) in CI.
- Recruit the PM practitioner review called for in PRD §20 before any real
  user uploads real work.
- Downloadable PDF portfolio export (PRD §21 flags this as an open
  decision for 0.2).
- Bias testing across equivalent submissions with varied names/demographic
  signals, per the PRD's AI guardrails (§11.2) — not yet performed.
- Data retention policy implementation (draft/inactive-account/verification
  retention periods — PRD §21 open decision).
