/**
 * Seeds a real Supabase project with the Northstar scenario content.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the
 * environment. Safe to re-run — every insert is an upsert.
 *
 * Usage: npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import {
  CHARACTERS,
  COMMUNICATIONS,
  EXPERIENCE_ID,
  EXPERIENCE_SUMMARY,
  REQUIREMENTS_MEETING,
  TASKS,
} from "../lib/scenario";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

const EPISODES = [
  { id: "ep-1", prd_episode_number: 1, title: "First day and induction", stage_key: "induction", sequence: 1, competencies: ["professional_communication"] },
  { id: "ep-2", prd_episode_number: 2, title: "Project briefing", stage_key: "briefing", sequence: 2, competencies: ["professional_communication"] },
  { id: "ep-3", prd_episode_number: 3, title: "Requirements meeting", stage_key: "requirements_meeting", sequence: 3, competencies: ["professional_communication", "project_organisation", "stakeholder_management"] },
  { id: "ep-6", prd_episode_number: 6, title: "Risks and issues", stage_key: "raid_log", sequence: 4, competencies: ["risk_and_issue_management", "project_organisation", "professional_judgement"] },
  { id: "ep-9", prd_episode_number: 9, title: "Testing and privacy incident", stage_key: "testing_incident", sequence: 5, competencies: ["data_protection_awareness", "quality_and_testing_awareness", "professional_judgement", "change_support"] },
];

async function main() {
  console.log("Seeding experience...");
  await supabase.from("experiences").upsert({
    id: EXPERIENCE_ID,
    title: EXPERIENCE_SUMMARY.title,
    organisation: EXPERIENCE_SUMMARY.organisation,
    project_name: EXPERIENCE_SUMMARY.project,
    role_title: EXPERIENCE_SUMMARY.roleTitle,
    manager_name: EXPERIENCE_SUMMARY.manager,
    summary: `${EXPERIENCE_SUMMARY.industry} — ${EXPERIENCE_SUMMARY.projectType}`,
    version: "0.1",
    published: true,
  });

  console.log("Seeding episodes...");
  await supabase.from("episodes").upsert(
    EPISODES.map((e) => ({ ...e, experience_id: EXPERIENCE_ID, unlock_rule: "previous_stage_complete" })),
  );

  console.log("Seeding characters...");
  await supabase.from("characters").upsert(
    CHARACTERS.map((c) => ({
      id: c.id,
      experience_id: EXPERIENCE_ID,
      name: c.name,
      role_title: c.roleTitle,
      authority_level: c.authorityLevel,
      responsibilities: c.responsibilities,
      communication_style: c.communicationStyle,
      knows: c.knows,
      does_not_know: c.doesNotKnow,
      contact_conditions: c.contactConditions,
      approval_boundaries: c.approvalBoundaries,
    })),
  );

  console.log("Seeding communications...");
  await supabase.from("communications").upsert(
    COMMUNICATIONS.map((c) => ({
      id: c.id,
      experience_id: EXPERIENCE_ID,
      kind: c.kind,
      from_character_id: c.fromCharacterId,
      subject: c.subject,
      body_markdown: c.bodyMarkdown,
      sent_at_stage_start: c.sentAtStageStart,
      requires_reply: c.requiresReply,
      thread_id: c.threadId ?? null,
    })),
  );

  console.log("Seeding requirements meeting...");
  await supabase.from("meetings").upsert({
    id: REQUIREMENTS_MEETING.id,
    experience_id: EXPERIENCE_ID,
    title: REQUIREMENTS_MEETING.title,
    purpose: REQUIREMENTS_MEETING.purpose,
    participants: REQUIREMENTS_MEETING.participants,
    agenda: REQUIREMENTS_MEETING.agenda,
    transcript: REQUIREMENTS_MEETING.transcript,
    decisions: REQUIREMENTS_MEETING.decisions,
    actions: REQUIREMENTS_MEETING.actions,
    stage_key: REQUIREMENTS_MEETING.stage,
  });

  console.log("Seeding tasks...");
  await supabase.from("tasks").upsert(
    TASKS.map((t) => ({
      code: t.code,
      experience_id: EXPERIENCE_ID,
      title: t.title,
      stage_key: t.stage,
      business_context: t.businessContext,
      instructions: t.instructions,
      resources: t.resources,
      quality_criteria: t.qualityCriteria,
      competencies: t.competencies,
      due_offset_hours: t.dueOffsetHours,
      work_product_label: t.workProductLabel,
    })),
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
