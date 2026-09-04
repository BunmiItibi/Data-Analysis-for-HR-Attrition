import type {
  CompetencyAssessment,
  EscalationRecommendationContent,
  RaidLogContent,
  RequirementsSummaryContent,
  ScoreLevel,
  SubmissionContent,
} from "@/lib/domain/types";
import { getRubric } from "./rubric";

/**
 * Deterministic, rule-based scoring used when ANTHROPIC_API_KEY is not
 * configured (demo mode). Every score traces to an explicit, inspectable
 * rule rather than a black box — appropriate for a fallback that must stay
 * auditable. See lib/ai/anthropicProvider.ts for the live equivalent.
 */

function clampScore(n: number): ScoreLevel {
  return Math.max(1, Math.min(5, Math.round(n))) as ScoreLevel;
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function scoreRequirementsSummary(data: RequirementsSummaryContent): CompetencyAssessment[] {
  const rubric = getRubric("requirements-summary");
  const decisionText = data.decisions.join(" ").toLowerCase();
  const mentionsCancellationDecision = /24[- ]hour|cancellation/.test(decisionText);
  const mentionsAddressDecision = /address/.test(decisionText);
  const mobileMentionedAsDecision = /mobile|cancel button/.test(decisionText);

  const communicationScore = clampScore(
    2 + (wordCount(data.summary) >= 25 ? 1 : 0) + (data.decisions.length >= 1 ? 1 : 0) + (data.actions.length >= 2 ? 1 : 0),
  );

  const organisationBase =
    2 +
    (mentionsCancellationDecision ? 1 : 0) +
    (mentionsAddressDecision ? 1 : 0) -
    (mobileMentionedAsDecision ? 1 : 0) +
    (data.openQuestions.length > 0 || data.decisions.length + data.actions.length >= 3 ? 1 : 0);
  const organisationScore = clampScore(organisationBase);

  const namedOwners = ["sarah", "daniel", "maya", "lucy"];
  const actionsWithRealOwners = data.actions.filter((a) =>
    namedOwners.some((n) => a.owner.toLowerCase().includes(n)),
  ).length;
  const actionsWithDates = data.actions.filter((a) => a.dueDate.trim().length > 0).length;
  const stakeholderScore = clampScore(
    2 + (actionsWithRealOwners >= 1 ? 1 : 0) + (actionsWithDates === data.actions.length && data.actions.length > 0 ? 2 : 0),
  );

  return [
    {
      competency: rubric[0].competency,
      criterion: rubric[0].criterion,
      score: communicationScore,
      evidence:
        data.summary.slice(0, 220) || "No summary text was provided.",
      strength:
        communicationScore >= 4
          ? "The summary is concise and gives a colleague enough context to act without re-reading the transcript."
          : "A summary was produced covering the meeting's main topic.",
      gap:
        communicationScore < 4
          ? "The summary is thin — add enough context that someone who missed the meeting could follow the reasoning, not just the outcome."
          : "None significant at this level.",
      improvement:
        "Aim for 3–5 sentences that explain what was discussed, what was decided, and why, before listing actions separately.",
      confidence: "medium",
      humanReviewFlag: false,
      safetyFlag: false,
    },
    {
      competency: rubric[1].competency,
      criterion: rubric[1].criterion,
      score: organisationScore,
      evidence: `Decisions recorded: ${data.decisions.length ? data.decisions.join("; ") : "none"}.`,
      strength: mentionsCancellationDecision
        ? "Correctly captured the 24-hour cancellation notice-period decision — the one Lucy specifically needs in writing."
        : "Attempted to separate decisions from discussion.",
      gap: mobileMentionedAsDecision
        ? "The mobile cancel-button usability point was logged as a decision, but Sarah was explicit that Maya's write-up was an action, not a decision made in the meeting."
        : !mentionsCancellationDecision
          ? "The cancellation notice-period decision — the one item Lucy asked to have confirmed in writing — is missing or unclear."
          : "None significant at this level.",
      improvement:
        "Before listing something as a decision, check the transcript for an explicit agreement, not just a topic that was raised.",
      confidence: "medium",
      humanReviewFlag: false,
      safetyFlag: false,
    },
    {
      competency: rubric[2].competency,
      criterion: rubric[2].criterion,
      score: stakeholderScore,
      evidence: `${data.actions.length} action(s) recorded; ${actionsWithDates} with a due date.`,
      strength:
        actionsWithRealOwners >= 1
          ? "Actions are attributed to the people who actually committed to them in the meeting."
          : "Actions were captured from the meeting.",
      gap:
        actionsWithDates < data.actions.length
          ? "Not every action has a due date — Sarah needs dates to track follow-through, not just owners."
          : "None significant at this level.",
      improvement: "Cross-check every action against the transcript for an explicit owner and timeframe before finalising.",
      confidence: "medium",
      humanReviewFlag: false,
      safetyFlag: false,
    },
  ];
}

function scoreRaidLog(data: RaidLogContent): CompetencyAssessment[] {
  const rubric = getRubric("raid-log");
  const types = new Set(data.entries.map((e) => e.type));
  const coverage = ["risk", "issue", "assumption", "dependency"].filter((t) => types.has(t as never)).length;
  const coverageScore = clampScore(1 + coverage);

  const withOwnerAndImpact = data.entries.filter((e) => e.owner.trim().length > 0 && e.impact).length;
  const organisationScore = clampScore(
    data.entries.length === 0 ? 1 : 1 + Math.round((4 * withOwnerAndImpact) / data.entries.length),
  );

  const highImpactEntries = data.entries.filter((e) => e.impact === "high");
  const highImpactWithGoodMitigation = highImpactEntries.filter((e) => wordCount(e.mitigation) >= 6).length;
  const judgementScore = clampScore(
    highImpactEntries.length === 0
      ? 3
      : 2 + Math.round((3 * highImpactWithGoodMitigation) / highImpactEntries.length),
  );

  return [
    {
      competency: rubric[0].competency,
      criterion: rubric[0].criterion,
      score: coverageScore,
      evidence: `Types present: ${[...types].join(", ") || "none"}. Total entries: ${data.entries.length}.`,
      strength: coverage >= 4 ? "All four RAID categories are represented." : "Some RAID categories are represented.",
      gap:
        coverage < 4
          ? `Missing categor${4 - coverage === 1 ? "y" : "ies"}: ${["risk", "issue", "assumption", "dependency"].filter((t) => !types.has(t as never)).join(", ")}.`
          : "None significant at this level.",
      improvement: "A workplace-ready RAID log covers all four categories, even if some entries are short.",
      confidence: "medium",
      humanReviewFlag: false,
      safetyFlag: false,
    },
    {
      competency: rubric[1].competency,
      criterion: rubric[1].criterion,
      score: organisationScore,
      evidence: `${withOwnerAndImpact} of ${data.entries.length} entries have both an owner and an impact rating.`,
      strength: withOwnerAndImpact === data.entries.length && data.entries.length > 0 ? "Every entry is owned and rated." : "Most entries carry the required fields.",
      gap: withOwnerAndImpact < data.entries.length ? "Some entries are missing an owner or impact rating, which makes them hard to act on." : "None significant at this level.",
      improvement: "Before submitting, check every row has a named owner and an impact rating — an entry without both isn't actionable.",
      confidence: "medium",
      humanReviewFlag: false,
      safetyFlag: false,
    },
    {
      competency: rubric[2].competency,
      criterion: rubric[2].criterion,
      score: judgementScore,
      evidence:
        highImpactEntries.length > 0
          ? `${highImpactWithGoodMitigation} of ${highImpactEntries.length} high-impact entries have a substantive mitigation.`
          : "No entries were marked high impact.",
      strength: judgementScore >= 4 ? "High-impact items have proportionate, substantive responses." : "A response was attempted for each entry.",
      gap: judgementScore < 4 && highImpactEntries.length > 0 ? "One or more high-impact entries has a thin or placeholder mitigation." : "None significant at this level.",
      improvement: "The higher the impact, the more specific the mitigation should be — 'monitor' alone is not enough for a high-impact risk.",
      confidence: "medium",
      humanReviewFlag: false,
      safetyFlag: false,
    },
  ];
}

function scoreEscalationRecommendation(data: EscalationRecommendationContent): CompetencyAssessment[] {
  const rubric = getRubric("escalation-recommendation");
  const notifiedText = data.peopleNotified.join(" ").toLowerCase();
  const escalatedToJames = /james|information governance|\bIG\b/i.test(data.peopleNotified.join(" ")) || /james|information governance/i.test(data.incidentSummary + data.recommendation);
  const dpaScore: ScoreLevel = escalatedToJames ? clampScore(4 + (notifiedText.includes("james") ? 1 : 0)) : 1;

  const mentionsEvidence = /concurrent|session|reference number|2 of|two of|low|intermittent/i.test(data.severityAssessment);
  const qualityScore = clampScore(2 + (mentionsEvidence ? 2 : 0) + (wordCount(data.severityAssessment) >= 15 ? 1 : 0));

  const overstepsAuthority = /i (have )?(decided|approve|authoris)/i.test(data.recommendation);
  const ignoresIssue = data.launchReadiness === "ready" && !/condition|fix|retest|verify/i.test((data.conditions ?? "") + data.recommendation);
  let judgementScore: ScoreLevel = 4;
  if (overstepsAuthority) judgementScore = 2;
  else if (ignoresIssue) judgementScore = 2;
  else if (data.launchReadiness === "conditional" && (data.conditions ?? "").trim().length > 0) judgementScore = 5;

  const otherDefectKeywords = ["confirmation", "mobile", "browser", "training"];
  const coveredOthers = otherDefectKeywords.filter((k) =>
    (data.incidentSummary + " " + data.recommendation).toLowerCase().includes(k),
  ).length;
  const changeSupportScore = clampScore(2 + coveredOthers);

  return [
    {
      competency: rubric[0].competency,
      criterion: rubric[0].criterion,
      score: dpaScore,
      evidence: `People notified: ${data.peopleNotified.length ? data.peopleNotified.join(", ") : "none recorded"}.`,
      strength: escalatedToJames
        ? "The privacy-relevant defect was correctly escalated to Information Governance (James Wilson), not just the delivery team."
        : "An incident summary was written.",
      gap: escalatedToJames
        ? "None significant at this level."
        : "This is a genuine data-protection concern — a cross-patient exposure of an appointment reference — and it was not escalated to Information Governance (James Wilson). Northstar's policy requires this to go to IG immediately.",
      improvement: escalatedToJames
        ? "Keep escalating privacy-relevant findings to Information Governance as a matter of course, even at low reproduction rates."
        : "Re-read the induction data-protection notice: any potential privacy issue is escalated to James Wilson (Information Governance), not just noted in the delivery team's own records.",
      confidence: escalatedToJames ? "medium" : "high",
      humanReviewFlag: true,
      safetyFlag: !escalatedToJames,
    },
    {
      competency: rubric[1].competency,
      criterion: rubric[1].criterion,
      score: qualityScore,
      evidence: data.severityAssessment.slice(0, 220) || "No severity assessment was provided.",
      strength: mentionsEvidence ? "The severity assessment engages with the actual test evidence (reproduction rate, what was and wasn't exposed)." : "A severity assessment was attempted.",
      gap: mentionsEvidence ? "None significant at this level." : "The severity assessment doesn't clearly reference the evidence — how often it reproduced and exactly what was exposed.",
      improvement: "Ground severity in the evidence: a rare but real cross-patient exposure of an identifier is serious even at a low reproduction rate — say why, using the numbers from the report.",
      confidence: "medium",
      humanReviewFlag: true,
      safetyFlag: false,
    },
    {
      competency: rubric[2].competency,
      criterion: rubric[2].criterion,
      score: judgementScore,
      evidence: data.recommendation.slice(0, 220) || "No recommendation was provided.",
      strength: judgementScore >= 4 ? "The recommendation is proportionate and appropriately scoped to a recommendation rather than a final decision." : "A recommendation was made.",
      gap:
        overstepsAuthority
          ? "The recommendation reads as a final decision ('I have decided/approved...'). As Project Officer, you recommend — the Project Board decides."
          : ignoresIssue
            ? "Recommending 'ready' without naming a condition (fix and retest) doesn't match evidence of an unresolved privacy-relevant defect."
            : "None significant at this level.",
      improvement: "Frame the recommendation as advice to Sarah and the Board, tied explicitly to conditions where relevant (e.g. 'conditional on the defect being fixed and retested before go-live').",
      confidence: "medium",
      humanReviewFlag: true,
      safetyFlag: false,
    },
    {
      competency: rubric[3].competency,
      criterion: rubric[3].criterion,
      score: changeSupportScore,
      evidence: `Other findings referenced: ${coveredOthers} of ${otherDefectKeywords.length}.`,
      strength: coveredOthers >= 2 ? "The recommendation reflects the whole testing report, not just the serious defect." : "The serious defect was addressed.",
      gap: coveredOthers < 2 ? "The other four findings from the testing report are barely acknowledged — Sarah needs the full picture, not just the headline issue." : "None significant at this level.",
      improvement: "Briefly acknowledge every finding in the report, even ones you're not prioritising, so nothing looks missed.",
      confidence: "medium",
      humanReviewFlag: true,
      safetyFlag: false,
    },
  ];
}

export function scoreSubmissionDemo(content: SubmissionContent): CompetencyAssessment[] {
  switch (content.taskCode) {
    case "requirements-summary":
      return scoreRequirementsSummary(content.data);
    case "raid-log":
      return scoreRaidLog(content.data);
    case "escalation-recommendation":
      return scoreEscalationRecommendation(content.data);
  }
}

export function buildDemoManagerNote(content: SubmissionContent, assessments: CompetencyAssessment[]): string {
  const weakest = [...assessments].sort((a, b) => a.score - b.score)[0];
  const strongest = [...assessments].sort((a, b) => b.score - a.score)[0];
  const openingByTask: Record<SubmissionContent["taskCode"], string> = {
    "requirements-summary": "Thanks for turning this round quickly — I've read it against my own notes from the meeting.",
    "raid-log": "I've gone through the RAID log against what we know so far.",
    "escalation-recommendation": "I've read your escalation and recommendation carefully — this one matters.",
  };
  return [
    openingByTask[content.taskCode],
    `What worked well: ${strongest.strength}`,
    `What needs improvement: ${weakest.gap}`,
    `Why it matters: on a real project, this is the kind of gap that costs the team time later, or in this case affects patients' trust that their information is handled properly — so it's worth getting right now while it's cheap to fix.`,
    `What to change: ${weakest.improvement}`,
    `This mainly speaks to your ${weakest.competency.replaceAll("_", " ")}. Revise and resubmit when you're ready — I'll look at both versions.`,
  ].join("\n\n");
}
