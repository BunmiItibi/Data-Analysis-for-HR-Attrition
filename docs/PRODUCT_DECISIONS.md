# Experix — Product Decisions Record

Source of truth: `docs/PRD_Experix_Digital_Project_Officer_MVP.md` (the
attached PRD, extracted verbatim). Where the build prompt narrows the PRD's
scope, that narrower scope governs this build; differences are listed below.

## 1. Scope: build prompt vs PRD

The PRD's Release 0.1 (§4.3) calls for a "vertical slice" with an evidence
gate of real users attempting/completing it — i.e. it expects a live pilot.
The build prompt that drove this implementation narrows Release 0.1 further,
to a **working software vertical slice**, not a live user pilot:

| Topic | PRD | This build |
|---|---|---|
| Episodes | 10 episodes across 4 simulated weeks (§7) | One vertical slice through the episodes needed to hit the 16-screen journey in the build prompt: induction → briefing → inbox → requirements meeting → RAID log → testing/privacy incident → feedback → revision → score → portfolio. Episodes 4, 5, 7, 8, 10 content (stakeholder map, delivery plan, status report, change-impact summary, handover) are **not** built in 0.1; they're Release 0.2 backlog. |
| Learner effort | "Six to eight hours" (§5) | Build prompt specifies "approximately two to three hours" for this first vertical slice — consistent with building fewer episodes, not with less depth per episode. |
| Build route | PRD recommends Lovable for the founder's first non-technical build (§1.2) | Build prompt specifies a developer-led Next.js/TypeScript/Tailwind/Supabase/Anthropic/Claude-Code build. Followed as instructed. |
| Verification links | PRD lists Verification (S17) and VerificationLink entity as Release 0.1 "Must" (§9, FR-18) | Build prompt explicitly says: "Do not create public portfolio access in Release 0.1. Build the private portfolio preview first and prepare the architecture for controlled verification links later." Followed: the `verification_links` table and its RLS exist in the schema (so 0.2 doesn't need a migration to add the concept), but no UI issues, resolves or serves a public link in 0.1. |
| Admin console | PRD S18 / FR-20, full admin interface | Build prompt says "a minimum administrator interface." 0.1 ships a minimal, auth-gated review queue view (flagged assessments) rather than full content/participant management. Content is managed by editing seed files, not a CMS UI. |
| Payments, notifications, reflection/STAR/CV drafts | PRD marks these "Should"/"Later" (FR-21–24) | Not built in 0.1; listed in the 0.2 backlog. |

## 2. Demo mode is first-class, not an afterthought

This sandbox has no live Supabase project and no live Anthropic API key.
Rather than build something that only theoretically works once credentials
exist, the app is architected so that:

- `lib/supabase/client.ts` detects missing `NEXT_PUBLIC_SUPABASE_URL` /
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` and falls back to an in-memory/localStorage
  demo store with the same repository interface real Supabase-backed code
  uses. Swapping in real credentials swaps the backing store, not the call
  sites.
- `lib/ai/provider.ts` detects a missing `ANTHROPIC_API_KEY` and falls back
  to deterministic, scenario-grounded canned responses (character replies,
  rubric-scored assessments) drawn from the same seed content a real Claude
  call would be grounded in. Every screen that shows AI output displays a
  "Demo mode" badge when running on fallback data.
- The acceptance criteria ("a new user can register… without founder
  intervention", "AI feedback cites specific evidence…") are therefore
  verifiable today, in demo mode, without provisioning any external service.

## 3. Data model differences from PRD §15

The PRD's `Submission` entity implicitly covers versioning; the build
prompt's acceptance criteria (AC-08: "Original and revised work remain
distinguishable and time-stamped") is best served by a first-class
`submission_versions` child table rather than overloading `submissions`
rows. This is additive, not a scope change — see
`supabase/migrations/0001_initial_schema.sql`.

## 4. Assumptions

- "UK graduate" persona (§3.1–3.2) informs tone and terminology (e.g. NHS
  context, UK date format) but no UK-specific legal/consent copy beyond
  what's in the PRD is invented.
- Facilitator/reviewer and content-administrator roles (§3.3) are modelled
  in the schema and RLS (`app_role` on `profiles`) but 0.1 ships only the
  minimal review-queue UI described above for them; there is no distinct
  content-authoring UI.
- Where the PRD gives a table of requirements without literal copy (e.g.
  meeting transcripts, emails, testing report), original fictional content
  was authored for this build, matching every constraint in PRD §14 (no real
  NHS/patient data, competing but legitimate stakeholder priorities, defects
  listed in the build prompt's testing-report spec).
- "Automated tests for critical flows" is interpreted as: unit/integration
  tests for scoring, state machines and Zod schemas (fast, no external
  services required) plus a Playwright smoke test of the full demo-mode
  journey. Full RLS policy tests against a live Supabase instance are listed
  as a known limitation (§ below) since no live project exists in this
  environment.

## 5. Unresolved decisions carried forward (PRD §21)

These remain open and are **not** decided by this build; they are flagged
here for the founder/product owner, per the PRD's own list:

- Founding learner price and scholarship limit.
- Appointing a qualified PM practitioner to review rubrics before any real
  pilot.
- Whether portfolio evidence gets a downloadable PDF in 0.2 (0.1 is
  web-only, as the PRD allows).
- Final AI provider/model choice and cost ceiling for a paid pilot (0.1
  uses Claude via the Anthropic Messages API behind the provider interface,
  swappable).
- Data retention periods for drafts, inactive accounts and (later)
  verification links.
- Minimum required artefacts/competency threshold for "placement complete"
  — 0.1 assumes the three mandated work products (requirements summary,
  RAID log, escalation recommendation) are the completion gate, matching
  AC-04.

## 6. Release 0.1 page and feature inventory (confirmed)

1. Landing (`/`)
2. Register / Login (`/register`, `/login`)
3. Experience Identity (`/identity`)
4. Placement listing (`/placements`)
5. Placement offer & acceptance (`/placements/[id]`)
6. Induction (`/induction`)
7. Workplace dashboard (`/dashboard`)
8. Inbox (`/inbox`, `/inbox/[id]`)
9. Requirements meeting (`/meetings/[id]`)
10. RAID log task + workspace (`/tasks/[id]`)
11. Testing report + privacy incident + escalation task (`/tasks/[id]`)
12. Manager feedback (`/submissions/[id]/feedback`)
13. Revision & resubmission (`/submissions/[id]/revise`)
14. Experience Score (`/score`)
15. Portfolio evidence preview (`/portfolio`)
16. Minimal review queue (`/admin/review`) — staff-only, out of the learner
    journey, satisfying FR-15/FR-20 at MVP depth.

This matches the build prompt's 16-item core learner flow and the PRD's
Core Screen Inventory (§8) minus S17 Verification (deferred per §1 above).
