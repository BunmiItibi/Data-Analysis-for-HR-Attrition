import type { InductionItemId } from "@/lib/domain/types";

export const PLACEMENT = {
  title: "Digital Software Project Officer Virtual Work Placement",
  organisation: "Northstar Health Digital",
  project: "Northstar Patient Access Portal",
  manager: "Sarah Mitchell, Senior Project Manager",
  industry: "Healthcare technology (fictional)",
  simulatedDuration: "Four simulated working weeks, compressed into this vertical slice",
  expectedEffort: "Approximately 2–3 hours for this Release 0.1 vertical slice",
  responsibilities: [
    "Support the Senior Project Manager in coordinating delivery",
    "Record accurate meeting outputs, actions and decisions",
    "Maintain the project's risk, assumption, issue and dependency records",
    "Review evidence, investigate concerns and write clear recommendations",
    "Escalate risks and concerns through the right channel, promptly",
  ],
  notResponsibleFor: [
    "Approving budget or funding changes",
    "Authorising scope changes to the project",
    "Making the final go-live decision",
  ],
  conduct: [
    "Use only the fictional Northstar information provided in this placement",
    "Never enter real patient, NHS, employer or other confidential information anywhere in the app",
    "Record what actually happened, and say when you are not sure",
    "Escalate anything that looks like a data-protection concern immediately",
  ],
  evidenceYouWillLeaveWith: [
    "A requirements meeting summary you wrote",
    "A RAID log you maintained",
    "A privacy-incident escalation and launch-readiness recommendation you authored",
    "Manager feedback tied to your actual work, and your revisions in response to it",
    "A developmental Experience Score across ten workplace competencies",
    "A portfolio preview you can show a prospective employer",
  ],
};

export const INDUCTION_ITEMS: { id: InductionItemId; title: string; body: string }[] = [
  {
    id: "org-profile",
    title: "About Northstar Health Digital",
    body: "Read the organisation profile: who Northstar is (a fictional team), how the delivery structure is organised, and the values that shape how the team works.",
  },
  {
    id: "team-directory",
    title: "Meet your team",
    body: "Review the eight people you'll be working with this placement, what each of them owns, and what decisions sit above your authority as Project Officer.",
  },
  {
    id: "role-responsibilities",
    title: "Your role as Project Officer",
    body: "Understand what you are responsible for — and, just as importantly, what you are not responsible for. You support, coordinate, record and recommend. You do not approve funding, authorise scope changes or decide go-live.",
  },
  {
    id: "conduct-policy",
    title: "Workplace conduct",
    body: "Northstar expects accuracy, prompt escalation and respect for authority boundaries. Read the short conduct policy before your first day.",
  },
  {
    id: "data-protection-notice",
    title: "Data protection in this placement",
    body: "This is a simulated workplace. Never enter real patient, NHS, employer or confidential information anywhere in Experix — use only the fictional Northstar details provided to you.",
  },
];
