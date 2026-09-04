# CLAUDE.md — Experix

Guidance for anyone (human or AI) working in this repository.

## What this repository is

This repository hosts **Experix**, an AI-powered simulated work-experience and
employability platform. It also retains, under `legacy-hr-attrition-analysis/`,
an unrelated earlier HR attrition data-analysis project. That folder is
historical and out of scope for Experix work — do not modify it unless asked.

## Product purpose (source of truth: `docs/PRD_Experix_Digital_Project_Officer_MVP.md`)

Graduates often have qualifications but lack credible project work experience,
so they struggle to demonstrate workplace capability to employers. Experix is
**not** a course, a PRINCE2 tutorial or a quiz app. It is a simulated
workplace: the learner performs realistic Project Officer activities inside a
fictional software project, produces real work products, receives
evidence-linked manager feedback, revises work, and leaves with a portfolio an
employer can inspect.

Permanent product rule: every feature must create realistic work, develop an
employable capability, produce credible evidence, improve interview
readiness, or reduce employer uncertainty. Nothing else gets built.

## Release 0.1 scope (this build)

One experience only: **Digital Software Project Officer Virtual Work
Placement** at the fictional **Northstar Health Digital**, building the
**Northstar Patient Access Portal**. The full vertical slice:

landing → register/login → Experience Identity → placement listing → offer →
acceptance → induction → dashboard → inbox → requirements meeting → RAID log
→ testing/privacy incident → escalation recommendation → manager feedback →
revision/resubmission → Experience Score → portfolio preview.

Out of scope for 0.1 (see `docs/PRODUCT_DECISIONS.md` for the full list):
other careers/industries, the other 9 episodes beyond this vertical slice,
payments, public/employer verification links (architecture only — no public
access), org cohorts, native mobile apps, admin console beyond a minimal
review queue stub.

Where this build prompt and the PRD disagree, the narrower MVP scope in the
build prompt wins; differences are logged in `docs/PRODUCT_DECISIONS.md`.

## Non-negotiable product rules

- Never call this employment, employer endorsement, accreditation or
  guaranteed work experience. The disclosure statement must appear on every
  portfolio/evidence view:
  > "This candidate completed a structured simulated software-project work
  > placement through Experix. This does not represent employment by
  > Northstar Health Digital."
- No real NHS, patient, employer or confidential information anywhere —
  scenario content is entirely fictional. Show a visible warning against
  uploading real personal/patient data.
- The learner (Project Officer) never approves funding, authorises major
  scope changes, or makes the go-live decision. Those belong to Sarah
  Mitchell (PM) or the Project Board (Dr Amelia Grant).
- AI colleagues respond only from approved scenario facts and their own
  character's knowledge boundaries; they must admit when information is
  unavailable rather than invent facts, and must not complete assignments
  for the learner.
- Every assessment score must show rubric criterion, evidence, strength,
  gap, recommended improvement, confidence and human-review/safety flags.
  Never show an unexplained overall score. Never certify employment
  readiness from a single submission.
- Original and revised submissions are both retained and both viewable.

## Technical standards

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS.
- Supabase for auth, Postgres (with RLS) and storage. All Supabase writes
  that matter for integrity happen through server-side code, not trusted
  client mutations, for anything touching assessment or scoring.
- All AI calls (Anthropic) happen in server-side API routes only — never in
  browser code, never with a key exposed to the client.
- AI access goes through the provider interface in `lib/ai/provider.ts` so
  the model/vendor can be swapped without touching call sites.
- Zod validates every external input: form submissions, API route bodies,
  AI JSON responses before they're trusted or stored.
- **Demo mode**: when `NEXT_PUBLIC_SUPABASE_URL`/`ANTHROPIC_API_KEY` (etc.)
  are absent, the app must still run end-to-end using seeded fixture data
  and deterministic fallback AI responses, clearly labelled "Demo mode" in
  the UI. Never hard-code real credentials or secrets anywhere in the repo.
- No comments explaining *what* code does. Only comment non-obvious *why*.
- Don't build ahead of the current phase's scope — no speculative
  abstractions for episodes 2–10 beyond what the shared data model needs to
  stay coherent.

## Directory shape (created as the build proceeds)

```
app/                Next.js App Router routes (the 16+ MVP screens)
components/         Shared UI components
lib/
  ai/               Provider interface + Anthropic + demo fallback
  supabase/         Client/server Supabase helpers + demo-mode store
  scenario/         Northstar seed content (characters, emails, meetings…)
  assessment/       Rubrics, scoring logic
  validation/       Zod schemas
supabase/
  migrations/       SQL schema + RLS policies
docs/                PRD, product decisions, backlog, known limitations
tests/               Automated tests for the critical journey
```

## Running things

See `README.md` for setup, environment variables, migrations, seed data,
tests and demo mode instructions.
