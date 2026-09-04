# Experix — Digital Project Officer Work Placement (Release 0.1)

Experix is a simulated work-experience platform. This is the Release 0.1
vertical slice: a graduate can register, join a fictional healthcare
software project as a Project Officer at **Northstar Health Digital**,
produce three real work products, respond to a serious privacy incident,
receive evidence-linked manager feedback, revise their work, and leave with
a developmental Experience Score and a private portfolio preview.

The product's purpose, scope and the decisions behind this build are in
[`docs/PRD_Experix_Digital_Project_Officer_MVP.md`](docs/PRD_Experix_Digital_Project_Officer_MVP.md)
and [`docs/PRODUCT_DECISIONS.md`](docs/PRODUCT_DECISIONS.md). Coding
standards and non-negotiable product rules are in [`CLAUDE.md`](CLAUDE.md).

> This repository also contains an earlier, unrelated HR-attrition data
> analysis project, preserved under `legacy-hr-attrition-analysis/`. It has
> nothing to do with Experix.

## 1. Quick start — no setup required (demo mode)

Experix runs completely on your own machine with no external accounts,
credit card or API key. This is **demo mode**: it automatically activates
whenever Supabase and Anthropic credentials aren't configured, and is
clearly labelled with a banner across the top of every page.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Register an account with any email address
(nothing is actually emailed — this is a local demo), and work through the
placement. Your progress is saved to a local file at
`.demo-data/db.json` (never committed to git — it's in `.gitignore`), so
closing and reopening the dev server keeps your progress.

In demo mode:

- **Data** is stored in that local JSON file instead of Supabase.
- **AI colleague replies and manager feedback** come from a deterministic,
  rule-based engine instead of live Claude — the same rubric and evidence
  requirements apply, but responses are template-based rather than
  generated. Every AI-produced screen is labelled so you always know which
  mode you're in.

To start over, stop the server and delete `.demo-data/`.

## 2. Running with real credentials (Supabase + Anthropic)

### 2.1 Supabase (auth, database, storage)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run the contents of
   [`supabase/migrations/0001_initial_schema.sql`](supabase/migrations/0001_initial_schema.sql).
   This creates every table (users' profiles, enrollments, submissions,
   assessments, portfolio items, consent records, etc.) with row-level
   security already applied, so a learner can only ever read or write their
   own data.
3. From your Supabase project's **Settings → API** page, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
     it's server-only and used for seeding content and the admin review
     queue; it must never reach the browser)
4. Seed the fictional Northstar scenario content into your project:

   ```bash
   npm run db:seed
   ```

   This is safe to re-run any time — every insert is an upsert.

### 2.2 Anthropic (AI colleague replies and assessment)

1. Get an API key from [console.anthropic.com](https://console.anthropic.com).
2. Set `ANTHROPIC_API_KEY`. Optionally set `ANTHROPIC_MODEL` to pin a
   specific model (defaults to a current Claude model).

All Anthropic calls happen in server-side code only
(`lib/ai/anthropicProvider.ts`, called from Server Actions and Server
Components) — the key is never sent to the browser. If a live call ever
fails (bad key, network issue, malformed response), the app **falls back
to the same deterministic demo response** rather than breaking the
learner's journey — see `lib/ai/index.ts`.

### 2.3 Environment variables

Copy `.env.example` to `.env.local` and fill in the values above:

```bash
cp .env.example .env.local
```

`.env.local` is git-ignored. Never commit real credentials.

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Leaving data demo mode | Public — safe to expose to the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Leaving data demo mode | Public — RLS enforces real access control |
| `SUPABASE_SERVICE_ROLE_KEY` | Seeding content, admin review | **Secret** — server-only |
| `ANTHROPIC_API_KEY` | Leaving AI demo mode | **Secret** — server-only |
| `ANTHROPIC_MODEL` | Optional | Defaults to a current Claude model |

You can set Supabase variables without Anthropic ones (or vice versa) —
each half of the app falls back to demo mode independently.

## 3. Project structure

```
app/                Next.js App Router routes — the 16 Release 0.1 screens
components/         Shared UI (design system) and feature components
lib/
  domain/types.ts   Single source of truth: TypeScript types + Zod schemas
  data/             Repo interface; demo (JSON file) and Supabase backends
  ai/               AiProvider interface; Anthropic and demo backends
  assessment/       Rubrics and the deterministic demo scoring engine
  scenario/         Northstar Health Digital fictional content
  actions/          Server Actions (the only way the UI mutates state)
  auth/             Password hashing (demo mode) and session helpers
  supabase/         Supabase client helpers (server, browser, service role)
supabase/migrations/  SQL schema + row-level security policies
scripts/seed-supabase.ts  Seeds a real Supabase project from lib/scenario
docs/               PRD, product decisions, known limitations, backlog
tests/
  unit/             Vitest — scoring, schemas, scenario integrity, dashboard logic
  e2e/              Playwright — full critical journey + accessibility checks
```

## 4. Testing

```bash
npm run test        # Vitest unit tests (fast, no server needed)
npm run test:e2e     # Playwright end-to-end tests (starts the dev server itself)
npm run typecheck    # tsc --noEmit
npm run lint          # ESLint
```

The e2e suite covers the full critical journey (registration through
portfolio, including a revision) and, separately, the case where a learner
fails to escalate the privacy defect to Information Governance — verifying
the safety flag fires correctly. It also runs automated WCAG 2.2 AA checks
(axe-core) on the landing, registration and dashboard pages.

If Playwright can't find a Chromium install in your environment, run
`npx playwright install chromium` first, or point `PLAYWRIGHT_CHROMIUM_PATH`
at an existing one.

## 5. Deployment

The app is a standard Next.js App Router project and deploys to any
Next.js-compatible host (Vercel, etc.):

```bash
npm run build
npm run start
```

Set the environment variables from section 2.3 in your hosting provider's
dashboard. Without them, a deployment will run in full demo mode — useful
for a public preview, but **the demo-mode data store is local to each
server instance and is not durable across restarts or multiple instances**,
so a real deployment intended for real users needs Supabase configured.

## 6. Known limitations

See [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md).

## 7. Release 0.2 backlog

See [`docs/RELEASE_0.2_BACKLOG.md`](docs/RELEASE_0.2_BACKLOG.md).

## 8. Product and safety guardrails (short version)

- Every AI assessment shows the rubric criterion, evidence from the
  learner's own submission, strength, gap, recommended improvement,
  confidence, and human-review/safety flags — never an unexplained score.
- The privacy-incident escalation task always flags every competency for
  human review, and raises a safety flag if the learner fails to escalate
  the defect to Information Governance.
- Original and revised submissions are both retained and both viewable.
- The mandatory simulation disclosure appears on the portfolio page:
  *"This candidate completed a structured simulated software-project work
  placement through Experix. This does not represent employment by
  Northstar Health Digital."*
- No real NHS, patient, employer or confidential information is used
  anywhere — the organisation, project and every character are fictional.
