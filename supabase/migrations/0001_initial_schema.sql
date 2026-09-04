-- Experix Release 0.1 — initial schema
-- Covers the PRD §15 data model as scoped for the Digital Project Officer
-- vertical slice. Row-level security throughout: a learner can only reach
-- their own rows; facilitators/admins get broader read access; nothing is
-- publicly readable (Release 0.1 has no public verification links — see
-- docs/PRODUCT_DECISIONS.md §1).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  app_role text not null default 'learner' check (app_role in ('learner', 'facilitator', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: staff read all" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- Experience profile (career goal / readiness — one per learner)
-- ---------------------------------------------------------------------
create table public.experience_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  career_goal text not null,
  current_situation text not null,
  development_priorities text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.experience_profiles enable row level security;

create policy "experience_profiles: owner rw" on public.experience_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "experience_profiles: staff read" on public.experience_profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- Experiences (Release 0.1 seeds exactly one row: Northstar Patient Access
-- Portal). Content-managed, not user-writable.
-- ---------------------------------------------------------------------
create table public.experiences (
  id text primary key,
  title text not null,
  organisation text not null,
  project_name text not null,
  role_title text not null,
  manager_name text not null,
  summary text not null,
  version text not null default '0.1',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.experiences enable row level security;

create policy "experiences: read published" on public.experiences
  for select using (published = true);

create policy "experiences: staff manage" on public.experiences
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role = 'admin')
  );

-- ---------------------------------------------------------------------
-- Episodes (content-managed; Release 0.1 seeds episodes 1, 2, 3, 6, 9 — see
-- docs/PRODUCT_DECISIONS.md for which PRD episodes are in scope)
-- ---------------------------------------------------------------------
create table public.episodes (
  id text primary key,
  experience_id text not null references public.experiences (id) on delete cascade,
  prd_episode_number int not null,
  title text not null,
  stage_key text not null,
  sequence int not null,
  unlock_rule text not null default 'previous_stage_complete',
  competencies text[] not null default '{}'
);

alter table public.episodes enable row level security;

create policy "episodes: read all authenticated" on public.episodes
  for select using (auth.role() = 'authenticated');

create policy "episodes: staff manage" on public.episodes
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role = 'admin')
  );

-- ---------------------------------------------------------------------
-- Characters (content-managed)
-- ---------------------------------------------------------------------
create table public.characters (
  id text primary key,
  experience_id text not null references public.experiences (id) on delete cascade,
  name text not null,
  role_title text not null,
  authority_level text not null,
  responsibilities text[] not null default '{}',
  communication_style text not null,
  knows text[] not null default '{}',
  does_not_know text[] not null default '{}',
  contact_conditions text[] not null default '{}',
  approval_boundaries text[] not null default '{}'
);

alter table public.characters enable row level security;

create policy "characters: read all authenticated" on public.characters
  for select using (auth.role() = 'authenticated');

create policy "characters: staff manage" on public.characters
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role = 'admin')
  );

-- ---------------------------------------------------------------------
-- Enrollment (one learner's placement state)
-- ---------------------------------------------------------------------
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  experience_id text not null references public.experiences (id),
  state text not null default 'invited'
    check (state in ('invited','applied','offered','accepted','active','paused','awaiting_review','completed','withdrawn')),
  stage text not null default 'induction',
  applied_at timestamptz,
  offered_at timestamptz,
  accepted_at timestamptz,
  completed_at timestamptz,
  induction_completed_item_ids text[] not null default '{}',
  scenario_flags jsonb not null default '{}',
  unique (user_id, experience_id)
);

alter table public.enrollments enable row level security;

create policy "enrollments: owner rw" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "enrollments: staff read" on public.enrollments
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- Communications (content-managed emails/notifications) and learner replies
-- ---------------------------------------------------------------------
create table public.communications (
  id text primary key,
  experience_id text not null references public.experiences (id) on delete cascade,
  kind text not null check (kind in ('email', 'notification')),
  from_character_id text references public.characters (id),
  subject text not null,
  body_markdown text not null,
  sent_at_stage_start text not null,
  requires_reply boolean not null default false,
  thread_id text
);

alter table public.communications enable row level security;

create policy "communications: read all authenticated" on public.communications
  for select using (auth.role() = 'authenticated');

create policy "communications: staff manage" on public.communications
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role = 'admin')
  );

create table public.communication_replies (
  id uuid primary key default gen_random_uuid(),
  communication_id text not null references public.communications (id),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body_markdown text not null,
  character_follow_up text,
  created_at timestamptz not null default now()
);

alter table public.communication_replies enable row level security;

create policy "communication_replies: owner rw" on public.communication_replies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "communication_replies: staff read" on public.communication_replies
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- Meetings (content-managed)
-- ---------------------------------------------------------------------
create table public.meetings (
  id text primary key,
  experience_id text not null references public.experiences (id) on delete cascade,
  title text not null,
  purpose text not null,
  participants text[] not null default '{}',
  agenda jsonb not null default '[]',
  transcript jsonb not null default '[]',
  decisions jsonb not null default '[]',
  actions jsonb not null default '[]',
  stage_key text not null
);

alter table public.meetings enable row level security;

create policy "meetings: read all authenticated" on public.meetings
  for select using (auth.role() = 'authenticated');

create policy "meetings: staff manage" on public.meetings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role = 'admin')
  );

-- ---------------------------------------------------------------------
-- Tasks (content-managed work-product definitions)
-- ---------------------------------------------------------------------
create table public.tasks (
  code text primary key,
  experience_id text not null references public.experiences (id) on delete cascade,
  title text not null,
  stage_key text not null,
  business_context text not null,
  instructions text[] not null default '{}',
  resources jsonb not null default '[]',
  quality_criteria jsonb not null default '[]',
  competencies text[] not null default '{}',
  due_offset_hours int not null default 24,
  work_product_label text not null
);

alter table public.tasks enable row level security;

create policy "tasks: read all authenticated" on public.tasks
  for select using (auth.role() = 'authenticated');

create policy "tasks: staff manage" on public.tasks
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role = 'admin')
  );

-- ---------------------------------------------------------------------
-- Submissions and versions (the learner's actual work products)
-- ---------------------------------------------------------------------
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  task_code text not null references public.tasks (code),
  status text not null default 'draft'
    check (status in ('draft','submitted','feedback_available','revision_requested','resubmitted','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, task_code)
);

alter table public.submissions enable row level security;

create policy "submissions: owner rw" on public.submissions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "submissions: staff read" on public.submissions
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

create table public.submission_versions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions (id) on delete cascade,
  version_number int not null,
  kind text not null check (kind in ('original', 'revision')),
  content jsonb not null,
  created_at timestamptz not null default now(),
  unique (submission_id, version_number)
);

alter table public.submission_versions enable row level security;

create policy "submission_versions: owner rw" on public.submission_versions
  for all using (
    exists (select 1 from public.submissions s where s.id = submission_id and s.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.submissions s where s.id = submission_id and s.user_id = auth.uid())
  );

create policy "submission_versions: staff read" on public.submission_versions
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- Assessments (one per submission version) and competency line items
-- ---------------------------------------------------------------------
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  submission_version_id uuid not null references public.submission_versions (id) on delete cascade,
  task_code text not null references public.tasks (code),
  manager_note text not null,
  source text not null check (source in ('ai', 'demo', 'human')),
  human_review_status text not null default 'not_required'
    check (human_review_status in ('not_required', 'pending', 'reviewed')),
  created_at timestamptz not null default now()
);

alter table public.assessments enable row level security;

create policy "assessments: owner read" on public.assessments
  for select using (
    exists (
      select 1 from public.submission_versions v
      join public.submissions s on s.id = v.submission_id
      where v.id = submission_version_id and s.user_id = auth.uid()
    )
  );

create policy "assessments: staff rw" on public.assessments
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

create table public.competency_assessments (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  competency text not null,
  criterion text not null,
  score int not null check (score between 1 and 5),
  evidence text not null,
  strength text not null,
  gap text not null,
  improvement text not null,
  confidence text not null check (confidence in ('low', 'medium', 'high')),
  human_review_flag boolean not null default false,
  safety_flag boolean not null default false
);

alter table public.competency_assessments enable row level security;

create policy "competency_assessments: owner read" on public.competency_assessments
  for select using (
    exists (
      select 1 from public.assessments a
      join public.submission_versions v on v.id = a.submission_version_id
      join public.submissions s on s.id = v.submission_id
      where a.id = assessment_id and s.user_id = auth.uid()
    )
  );

create policy "competency_assessments: staff rw" on public.competency_assessments
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- Interactions (audit trail of learner actions + AI responses)
-- ---------------------------------------------------------------------
create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.interactions enable row level security;

create policy "interactions: owner rw" on public.interactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "interactions: staff read" on public.interactions
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- Portfolio items (evidence selected for the private portfolio preview)
-- ---------------------------------------------------------------------
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  submission_version_id uuid not null references public.submission_versions (id),
  title text not null,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

create policy "portfolio_items: owner rw" on public.portfolio_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "portfolio_items: staff read" on public.portfolio_items
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- Verification links — schema only in Release 0.1. No route serves these
-- publicly yet; see docs/PRODUCT_DECISIONS.md §1. Kept here so Release 0.2
-- adds a route, not a migration.
-- ---------------------------------------------------------------------
create table public.verification_links (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'base64url'),
  permissions jsonb not null default '{}',
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz
);

alter table public.verification_links enable row level security;

create policy "verification_links: owner rw" on public.verification_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Deliberately no public/anon select policy in Release 0.1.

-- ---------------------------------------------------------------------
-- Consent (separate purpose-scoped records, never overwritten in place)
-- ---------------------------------------------------------------------
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  purpose text not null check (purpose in ('portfolio_display', 'case_study_use', 'marketing_contact')),
  version text not null default '1.0',
  granted boolean not null,
  responded_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

alter table public.consents enable row level security;

create policy "consents: owner rw" on public.consents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "consents: staff read" on public.consents
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.app_role in ('facilitator', 'admin'))
  );

-- ---------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger submissions_set_updated_at
  before update on public.submissions
  for each row execute procedure public.set_updated_at();
