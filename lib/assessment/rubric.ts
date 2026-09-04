import type { Competency, TaskCode } from "@/lib/domain/types";

export interface RubricItem {
  competency: Competency;
  criterion: string;
}

/**
 * The rubric each task is assessed against. Used both to instruct the live
 * Anthropic assessment call and to structure the deterministic demo-mode
 * fallback, so a learner sees the same criteria either way.
 */
export const RUBRICS: Record<TaskCode, RubricItem[]> = {
  "requirements-summary": [
    {
      competency: "professional_communication",
      criterion:
        "Writes a clear, well-organised summary a colleague could act on without re-reading the transcript.",
    },
    {
      competency: "project_organisation",
      criterion:
        "Distinguishes decisions actually made from topics merely discussed, and captures open questions separately rather than resolving them unilaterally.",
    },
    {
      competency: "stakeholder_management",
      criterion:
        "Actions have named owners and dates that reflect who was actually accountable in the meeting.",
    },
  ],
  "raid-log": [
    {
      competency: "risk_and_issue_management",
      criterion:
        "Includes at least one risk, assumption, issue and dependency, each grounded in the scenario rather than invented.",
    },
    {
      competency: "project_organisation",
      criterion: "Every entry has a named owner and an impact rating.",
    },
    {
      competency: "professional_judgement",
      criterion:
        "Mitigations are proportionate to impact — high-impact entries have a substantive response, not a placeholder.",
    },
  ],
  "escalation-recommendation": [
    {
      competency: "data_protection_awareness",
      criterion:
        "Recognises the cross-patient appointment-reference defect as privacy-relevant and escalates it to Information Governance (James Wilson), not just the delivery team.",
    },
    {
      competency: "quality_and_testing_awareness",
      criterion:
        "Severity assessment reflects the actual evidence — a low reproduction rate but a genuine cross-patient exposure of an identifier — without over- or under-stating it.",
    },
    {
      competency: "professional_judgement",
      criterion:
        "The recommendation is proportionate: it doesn't ignore the issue, and it doesn't overstep into making the final go-live decision, which belongs to the Project Board.",
    },
    {
      competency: "change_support",
      criterion: "Covers the full testing report — the other four findings are at least acknowledged, not just the serious one.",
    },
  ],
};

export function getRubric(taskCode: TaskCode): RubricItem[] {
  return RUBRICS[taskCode];
}
