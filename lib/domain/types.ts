import { z } from "zod";

/**
 * Domain types for the Experix Digital Project Officer MVP (Release 0.1).
 * Mirrors supabase/migrations/0001_initial_schema.sql. Kept as the single
 * source of truth for shapes shared between the demo store and a real
 * Supabase-backed store, so swapping backends never touches call sites.
 */

export const COMPETENCIES = [
  "professional_communication",
  "project_organisation",
  "planning_and_coordination",
  "stakeholder_management",
  "risk_and_issue_management",
  "change_support",
  "quality_and_testing_awareness",
  "data_protection_awareness",
  "professional_judgement",
  "adaptability_and_learning",
] as const;

export type Competency = (typeof COMPETENCIES)[number];

export const COMPETENCY_LABELS: Record<Competency, string> = {
  professional_communication: "Professional communication",
  project_organisation: "Project organisation",
  planning_and_coordination: "Planning and coordination",
  stakeholder_management: "Stakeholder management",
  risk_and_issue_management: "Risk and issue management",
  change_support: "Change support",
  quality_and_testing_awareness: "Quality and testing awareness",
  data_protection_awareness: "Data protection awareness",
  professional_judgement: "Professional judgement",
  adaptability_and_learning: "Adaptability and learning",
};

export const SCORE_LEVELS = [1, 2, 3, 4, 5] as const;
export type ScoreLevel = (typeof SCORE_LEVELS)[number];

export const SCORE_LABELS: Record<ScoreLevel, string> = {
  1: "Needs substantial support",
  2: "Developing",
  3: "Workplace ready with support",
  4: "Strong early-career capability",
  5: "Advanced for the role",
};

export const ENROLLMENT_STATES = [
  "invited",
  "applied",
  "offered",
  "accepted",
  "active",
  "paused",
  "awaiting_review",
  "completed",
  "withdrawn",
] as const;
export type EnrollmentState = (typeof ENROLLMENT_STATES)[number];

export const TASK_STATES = [
  "locked",
  "available",
  "in_progress",
  "submitted",
  "feedback_available",
  "revision_requested",
  "resubmitted",
  "completed",
] as const;
export type TaskState = (typeof TASK_STATES)[number];

/** The single ordered stage state-machine driving Release 0.1's vertical slice. */
export const STAGES = [
  "induction",
  "briefing",
  "requirements_meeting",
  "raid_log",
  "testing_incident",
  "escalation",
  "review",
  "completed",
] as const;
export type Stage = (typeof STAGES)[number];

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  appRole: "learner" | "facilitator" | "admin";
  createdAt: string;
}

export interface ExperienceProfile {
  userId: string;
  careerGoal: string;
  currentSituation: string;
  developmentPriorities: string[];
  updatedAt: string;
}

export interface CharacterKnowledge {
  knows: string[];
  doesNotKnow: string[];
  contactConditions: string[];
  approvalBoundaries: string[];
}

export interface Character extends CharacterKnowledge {
  id: string;
  name: string;
  roleTitle: string;
  authorityLevel: string;
  responsibilities: string[];
  communicationStyle: string;
  avatarInitials: string;
}

export type CommunicationKind = "email" | "notification";

export interface Communication {
  id: string;
  kind: CommunicationKind;
  fromCharacterId: string;
  subject: string;
  bodyMarkdown: string;
  sentAtStageStart: Stage;
  requiresReply: boolean;
  threadId?: string;
  attachments?: { label: string; description: string }[];
}

export interface CommunicationReply {
  id: string;
  communicationId: string;
  enrollmentId: string;
  bodyMarkdown: string;
  createdAt: string;
  /** A short in-character follow-up from the recipient, generated once when the learner replies. */
  characterFollowUp?: string;
}

export interface MeetingAgendaItem {
  title: string;
  owner: string;
}

export interface MeetingTranscriptLine {
  speaker: string;
  line: string;
}

export interface MeetingDecision {
  decision: string;
  rationale: string;
}

export interface MeetingActionSeed {
  action: string;
  owner: string;
  dueInDays: number;
}

export interface Meeting {
  id: string;
  title: string;
  purpose: string;
  participants: string[];
  agenda: MeetingAgendaItem[];
  transcript: MeetingTranscriptLine[];
  decisions: MeetingDecision[];
  actions: MeetingActionSeed[];
  stage: Stage;
}

export type TaskCode =
  | "requirements-summary"
  | "raid-log"
  | "escalation-recommendation";

export interface TaskQualityCriterion {
  label: string;
  detail: string;
}

export interface Task {
  code: TaskCode;
  title: string;
  stage: Stage;
  businessContext: string;
  instructions: string[];
  resources: { label: string; description: string }[];
  qualityCriteria: TaskQualityCriterion[];
  competencies: Competency[];
  dueOffsetHours: number;
  workProductLabel: string;
}

export const RAID_ENTRY_TYPES = ["risk", "issue", "assumption", "dependency"] as const;
export type RaidEntryType = (typeof RAID_ENTRY_TYPES)[number];

export interface RaidEntry {
  id: string;
  type: RaidEntryType;
  description: string;
  owner: string;
  impact: "low" | "medium" | "high";
  likelihood?: "low" | "medium" | "high";
  mitigation: string;
  status: "open" | "closed" | "monitoring";
}

export interface RequirementsSummaryContent {
  summary: string;
  decisions: string[];
  actions: { action: string; owner: string; dueDate: string }[];
  openQuestions: string[];
}

export interface RaidLogContent {
  entries: RaidEntry[];
}

export interface EscalationRecommendationContent {
  incidentSummary: string;
  severityAssessment: string;
  peopleNotified: string[];
  recommendation: string;
  launchReadiness: "ready" | "not_ready" | "conditional";
  conditions?: string;
}

export type SubmissionContent =
  | { taskCode: "requirements-summary"; data: RequirementsSummaryContent }
  | { taskCode: "raid-log"; data: RaidLogContent }
  | { taskCode: "escalation-recommendation"; data: EscalationRecommendationContent };

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "feedback_available"
  | "revision_requested"
  | "resubmitted"
  | "completed";

export interface SubmissionVersion {
  id: string;
  submissionId: string;
  versionNumber: number;
  kind: "original" | "revision";
  content: SubmissionContent;
  createdAt: string;
  assessment?: Assessment;
}

export interface Submission {
  id: string;
  enrollmentId: string;
  taskCode: TaskCode;
  status: SubmissionStatus;
  versions: SubmissionVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface CompetencyAssessment {
  competency: Competency;
  criterion: string;
  score: ScoreLevel;
  evidence: string;
  strength: string;
  gap: string;
  improvement: string;
  confidence: "low" | "medium" | "high";
  humanReviewFlag: boolean;
  safetyFlag: boolean;
}

export interface Assessment {
  id: string;
  submissionVersionId: string;
  taskCode: TaskCode;
  competencyAssessments: CompetencyAssessment[];
  managerNote: string;
  source: "ai" | "demo" | "human";
  createdAt: string;
  humanReviewStatus: "not_required" | "pending" | "reviewed";
}

export interface CompetencyScoreSummary {
  competency: Competency;
  level: ScoreLevel;
  rationale: string;
  evidenceRefs: { taskCode: TaskCode; excerpt: string }[];
  revisionDelta: number | null;
}

export interface Enrollment {
  id: string;
  userId: string;
  experienceId: string;
  state: EnrollmentState;
  stage: Stage;
  appliedAt: string | null;
  offeredAt: string | null;
  acceptedAt: string | null;
  completedAt: string | null;
  inductionCompletedItemIds: string[];
  scenarioFlags: Record<string, boolean>;
}

export interface Consent {
  id: string;
  userId: string;
  purpose: "portfolio_display" | "case_study_use" | "marketing_contact";
  version: string;
  granted: boolean;
  respondedAt: string;
  withdrawnAt: string | null;
}

export const INDUCTION_ITEM_IDS = [
  "org-profile",
  "team-directory",
  "conduct-policy",
  "data-protection-notice",
  "role-responsibilities",
] as const;
export type InductionItemId = (typeof INDUCTION_ITEM_IDS)[number];

/* ---------------------------------------------------------------------- */
/* Zod schemas for external input validation                              */
/* ---------------------------------------------------------------------- */

export const registerInputSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const experienceProfileInputSchema = z.object({
  careerGoal: z.string().trim().min(10, "Say a little more about your goal").max(500),
  currentSituation: z.string().trim().min(10, "Say a little more").max(500),
  developmentPriorities: z.array(z.string().trim().min(1)).min(1).max(5),
});
export type ExperienceProfileInput = z.infer<typeof experienceProfileInputSchema>;

export const communicationReplyInputSchema = z.object({
  communicationId: z.string().min(1),
  bodyMarkdown: z.string().trim().min(5, "Write a short reply").max(4000),
});

export const requirementsSummaryContentSchema = z.object({
  summary: z.string().trim().min(20).max(3000),
  decisions: z.array(z.string().trim().min(1)).max(20),
  actions: z
    .array(
      z.object({
        action: z.string().trim().min(1),
        owner: z.string().trim().min(1),
        dueDate: z.string().trim().min(1),
      }),
    )
    .max(20),
  openQuestions: z.array(z.string().trim().min(1)).max(20),
});

export const raidEntrySchema = z.object({
  id: z.string().min(1),
  type: z.enum(RAID_ENTRY_TYPES),
  description: z.string().trim().min(3).max(500),
  owner: z.string().trim().min(1).max(120),
  impact: z.enum(["low", "medium", "high"]),
  likelihood: z.enum(["low", "medium", "high"]).optional(),
  mitigation: z.string().trim().max(500),
  status: z.enum(["open", "closed", "monitoring"]),
});

export const raidLogContentSchema = z.object({
  entries: z.array(raidEntrySchema).max(40),
});

export const escalationRecommendationContentSchema = z.object({
  incidentSummary: z.string().trim().min(20).max(2000),
  severityAssessment: z.string().trim().min(10).max(1000),
  peopleNotified: z.array(z.string().trim().min(1)).max(10),
  recommendation: z.string().trim().min(20).max(2000),
  launchReadiness: z.enum(["ready", "not_ready", "conditional"]),
  conditions: z.string().trim().max(1000).optional(),
});

export const submissionContentSchema = z.discriminatedUnion("taskCode", [
  z.object({ taskCode: z.literal("requirements-summary"), data: requirementsSummaryContentSchema }),
  z.object({ taskCode: z.literal("raid-log"), data: raidLogContentSchema }),
  z.object({
    taskCode: z.literal("escalation-recommendation"),
    data: escalationRecommendationContentSchema,
  }),
]);

export const competencyAssessmentSchema = z.object({
  competency: z.enum(COMPETENCIES),
  criterion: z.string().min(1),
  score: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  evidence: z.string().min(1),
  strength: z.string().min(1),
  gap: z.string().min(1),
  improvement: z.string().min(1),
  confidence: z.enum(["low", "medium", "high"]),
  humanReviewFlag: z.boolean(),
  safetyFlag: z.boolean(),
});

export const assessmentResultSchema = z.object({
  competencyAssessments: z.array(competencyAssessmentSchema).min(1),
  managerNote: z.string().min(1),
});
export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

export const consentInputSchema = z.object({
  purpose: z.enum(["portfolio_display", "case_study_use", "marketing_contact"]),
  granted: z.boolean(),
});
