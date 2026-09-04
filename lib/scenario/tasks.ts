import type { Task } from "@/lib/domain/types";

export const TASKS: Task[] = [
  {
    code: "requirements-summary",
    title: "Write the requirements meeting summary",
    stage: "requirements_meeting",
    workProductLabel: "Requirements summary",
    businessContext:
      "Sarah, Lucy and Daniel will all work from whatever you write. Lucy specifically asked for the cancellation-notice decision in writing so she can update clinical operations. If your summary is inaccurate or vague, the team will act on the wrong information.",
    instructions: [
      "Review the requirements meeting transcript in full before you start.",
      "Write a short summary of what the meeting covered.",
      "List the decisions that were actually made — not topics that were merely discussed.",
      "List the actions, each with the owner and a due date, exactly as agreed in the meeting.",
      "List anything left open or unresolved. Do not resolve it yourself.",
    ],
    resources: [
      { label: "Requirements meeting transcript", description: "The full record of what was said in the meeting." },
      { label: "Project Overview", description: "Background on the Patient Access Portal, for context." },
    ],
    qualityCriteria: [
      { label: "Accuracy", detail: "Decisions and actions match what was actually agreed, not what you assume was agreed." },
      { label: "Distinguishes decisions from discussion", detail: "A topic that was raised but not resolved should appear as an open question, not a decision." },
      { label: "Owners and dates", detail: "Every action has a named owner and a due date." },
      { label: "No invented information", detail: "Nothing appears in your summary that wasn't in the meeting." },
    ],
    competencies: ["professional_communication", "project_organisation", "stakeholder_management"],
    dueOffsetHours: 24,
  },
  {
    code: "raid-log",
    title: "Open and maintain the RAID log",
    stage: "raid_log",
    workProductLabel: "RAID log",
    businessContext:
      "Sarah wants the project's risks, assumptions, issues and dependencies captured properly — not a long thin list, but entries the team can actually act on.",
    instructions: [
      "Review the requirements meeting outcomes and the Project Overview for material to draw on.",
      "Add at least one entry of each type: risk, assumption, issue and dependency.",
      "For each entry, write who owns it, how serious its impact is, and what is being done about it.",
      "Base every entry on something that actually happened or was said in the scenario so far — do not invent unrelated risks.",
    ],
    resources: [
      { label: "Requirements meeting summary (your own)", description: "Your accepted requirements summary is a good source of material." },
      { label: "Project Overview", description: "Background, scope and constraints for the portal." },
      { label: "RAID log template", description: "Type, description, owner, impact, likelihood (for risks), mitigation, status." },
    ],
    qualityCriteria: [
      { label: "Coverage", detail: "At least one risk, one assumption, one issue and one dependency, each grounded in the scenario." },
      { label: "Ownership", detail: "Every entry has a named owner who could realistically act on it." },
      { label: "Proportionate mitigation", detail: "The mitigation or response matches the entry's impact." },
      { label: "Traceability", detail: "Entries connect to something actually established in the meeting or briefing, not invented." },
    ],
    competencies: ["risk_and_issue_management", "project_organisation", "professional_judgement"],
    dueOffsetHours: 24,
  },
  {
    code: "escalation-recommendation",
    title: "Escalate the privacy concern and recommend on launch readiness",
    stage: "escalation",
    workProductLabel: "Escalation and launch-readiness recommendation",
    businessContext:
      "Rachel's testing report contains five findings. One of them — patients occasionally seeing another patient's appointment reference — is a potential data-protection incident, not a routine defect. Northstar's policy is clear: privacy-relevant issues get escalated to Information Governance immediately, not bundled quietly into a general defect list. You are not deciding whether the project can go live. You are gathering the facts, escalating the privacy issue to the right person, and giving Sarah a clear, evidence-based recommendation she can take to the Project Board.",
    instructions: [
      "Review the full software-testing report — all five findings, not just the serious one.",
      "Summarise the incident: what was observed, how often, and what was and wasn't exposed.",
      "Assess its severity and explain why it needs escalation to Information Governance (James Wilson), even though the root cause isn't confirmed yet.",
      "Record who you notified or recommend notifying.",
      "Give a clear, evidence-based recommendation on launch readiness: ready, not ready, or conditional — and if conditional, state the conditions.",
      "Remember: you are recommending, not deciding. The go-live decision belongs to the Project Board.",
    ],
    resources: [
      { label: "Software Testing Report — Cycle 3", description: "All five defects from this test cycle, with severity and evidence." },
      { label: "Northstar data protection notice", description: "From your induction: how Northstar expects privacy concerns to be handled." },
    ],
    qualityCriteria: [
      { label: "Recognises the privacy issue", detail: "The cross-patient appointment-reference defect is identified as privacy-relevant and treated with appropriate seriousness." },
      { label: "Escalates appropriately", detail: "James Wilson (Information Governance) is identified as notified or to be notified — not just Sarah or Daniel." },
      { label: "Evidence-based severity", detail: "The severity assessment reflects the actual evidence (low reproduction rate, but a real cross-patient exposure of an identifier) rather than over- or under-stating it." },
      { label: "Proportionate recommendation", detail: "The launch-readiness recommendation follows from the evidence, and does not overstep into a final go-live decision." },
      { label: "Covers the full report", detail: "The other four defects are at least acknowledged, not just the serious one." },
    ],
    competencies: ["data_protection_awareness", "quality_and_testing_awareness", "professional_judgement", "change_support"],
    dueOffsetHours: 24,
  },
];

export function getTask(code: string): Task {
  const task = TASKS.find((t) => t.code === code);
  if (!task) {
    throw new Error(`Unknown task: ${code}`);
  }
  return task;
}
