import type {
  Assessment,
  Communication,
  CommunicationReply,
  CompetencyScoreSummary,
  Consent,
  Enrollment,
  ExperienceProfile,
  Profile,
  Stage,
  Submission,
  SubmissionContent,
  TaskCode,
} from "@/lib/domain/types";

export interface AuthResult {
  user: Profile;
  sessionToken: string;
}

export interface PortfolioData {
  enrollment: Enrollment;
  profile: Profile;
  experienceProfile: ExperienceProfile | null;
  completedSubmissions: Submission[];
  competencyScores: CompetencyScoreSummary[];
  consents: Consent[];
}

export interface FlaggedAssessmentSummary {
  assessment: Assessment;
  userId: string;
  userFullName: string;
  taskCode: TaskCode;
}

/**
 * The single interface the whole application talks to for persistence and
 * auth. `lib/data/index.ts` selects the demo (file-backed) implementation or
 * the Supabase implementation at startup based on which environment
 * variables are present — every call site is identical either way.
 */
export interface Repo {
  readonly mode: "demo" | "supabase";

  registerUser(input: { fullName: string; email: string; password: string }): Promise<AuthResult>;
  loginUser(input: { email: string; password: string }): Promise<AuthResult>;
  logout(sessionToken: string): Promise<void>;
  getUserBySession(sessionToken: string): Promise<Profile | null>;

  saveExperienceProfile(
    userId: string,
    data: Pick<ExperienceProfile, "careerGoal" | "currentSituation" | "developmentPriorities">,
  ): Promise<ExperienceProfile>;
  getExperienceProfile(userId: string): Promise<ExperienceProfile | null>;

  getOrCreateEnrollment(userId: string): Promise<Enrollment>;
  applyToPlacement(userId: string): Promise<Enrollment>;
  acceptPlacement(userId: string): Promise<Enrollment>;
  completeInductionItem(userId: string, itemId: string): Promise<Enrollment>;
  finishInduction(userId: string): Promise<Enrollment>;
  advanceStage(userId: string, toStage: Stage): Promise<Enrollment>;
  setScenarioFlag(userId: string, key: string, value: boolean): Promise<Enrollment>;

  listCommunications(
    userId: string,
  ): Promise<{ communication: Communication; reply: CommunicationReply | null }[]>;
  replyToCommunication(userId: string, communicationId: string, bodyMarkdown: string): Promise<CommunicationReply>;

  getSubmission(userId: string, taskCode: TaskCode): Promise<Submission | null>;
  saveDraft(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission>;
  submitSubmission(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission>;
  reviseSubmission(userId: string, taskCode: TaskCode, content: SubmissionContent): Promise<Submission>;
  listSubmissions(userId: string): Promise<Submission[]>;

  getCompetencyScores(userId: string): Promise<CompetencyScoreSummary[]>;
  getPortfolio(userId: string): Promise<PortfolioData | null>;

  setConsent(userId: string, purpose: Consent["purpose"], granted: boolean): Promise<Consent>;
  listConsents(userId: string): Promise<Consent[]>;

  listFlaggedAssessments(): Promise<FlaggedAssessmentSummary[]>;
  markAssessmentReviewed(assessmentId: string): Promise<void>;
}

export class NotFoundError extends Error {}
export class ConflictError extends Error {}
export class AuthError extends Error {}
