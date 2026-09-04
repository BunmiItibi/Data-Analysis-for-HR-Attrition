import type { Stage } from "@/lib/domain/types";

export const EXPERIENCE_ID = "northstar-patient-access-portal";

export const EXPERIENCE_SUMMARY = {
  id: EXPERIENCE_ID,
  title: "Digital Software Project Officer Virtual Work Placement",
  organisation: "Northstar Health Digital",
  project: "Northstar Patient Access Portal",
  roleTitle: "Project Officer",
  manager: "Sarah Mitchell, Senior Project Manager",
  industry: "Healthcare technology (fictional)",
  projectType: "Software development",
  effort: "Approximately 2–3 hours",
} as const;

export const STAGE_LABELS: Record<Stage, string> = {
  induction: "Workplace induction",
  briefing: "Project briefing",
  requirements_meeting: "Requirements meeting",
  raid_log: "RAID log",
  testing_incident: "Testing and privacy incident",
  escalation: "Escalation and recommendation",
  review: "Manager feedback and revision",
  completed: "Experience Score and portfolio",
};

export const STAGE_ORDER: Stage[] = [
  "induction",
  "briefing",
  "requirements_meeting",
  "raid_log",
  "testing_incident",
  "escalation",
  "review",
  "completed",
];

export function nextStage(stage: Stage): Stage {
  const idx = STAGE_ORDER.indexOf(stage);
  return STAGE_ORDER[Math.min(idx + 1, STAGE_ORDER.length - 1)];
}

export * from "./characters";
export * from "./organisation";
export * from "./placement";
export * from "./communications";
export * from "./meetings";
export * from "./tasks";
export * from "./testingReport";
