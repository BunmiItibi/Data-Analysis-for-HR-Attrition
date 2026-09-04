import type { AssessmentResult, SubmissionContent } from "@/lib/domain/types";

export interface AssessSubmissionInput {
  content: SubmissionContent;
  isRevision: boolean;
  priorManagerNote?: string;
}

export interface CharacterFollowUpInput {
  characterId: string;
  originalSubject: string;
  learnerMessage: string;
  learnerCareerGoal?: string;
}

/**
 * Every AI call in the application goes through this interface, never
 * directly through a vendor SDK from a call site. `lib/ai/index.ts` picks
 * the Anthropic-backed implementation or the deterministic demo
 * implementation based on ANTHROPIC_API_KEY, and falls back to the demo
 * implementation if a live call fails, so the learner journey never breaks
 * because of an upstream outage.
 */
export interface AiProvider {
  readonly source: "ai" | "demo";
  assessSubmission(input: AssessSubmissionInput): Promise<AssessmentResult>;
  generateCharacterFollowUp(input: CharacterFollowUpInput): Promise<string>;
}
