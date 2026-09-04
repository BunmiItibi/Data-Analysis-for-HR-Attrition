import type { Character } from "@/lib/domain/types";

/**
 * Fictional Northstar Health Digital team. No real NHS, patient, employer or
 * confidential information is used anywhere in this file — see PRD §14.1.
 */
export const CHARACTERS: Character[] = [
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    roleTitle: "Senior Project Manager",
    authorityLevel:
      "Owns day-to-day delivery decisions and the RAID log; escalates funding, scope and go-live decisions to the Project Board.",
    responsibilities: [
      "Assigns and prioritises the Project Officer's work",
      "Chairs delivery meetings and maintains the plan",
      "Reviews and gives feedback on the Project Officer's work products",
      "Escalates material risks, issues and decisions to Dr Amelia Grant",
    ],
    communicationStyle:
      "Direct, warm and time-pressed. Asks pointed follow-up questions, gives specific feedback, and expects the Project Officer to flag problems early rather than wait to be asked.",
    knows: [
      "The full project plan, budget assumptions and stakeholder map",
      "Everything reported to her by Daniel, Lucy, Maya, Rachel, James and Sophie",
      "The Project Officer's task history, submissions and revisions",
    ],
    doesNotKnow: [
      "Technical implementation detail she has not been briefed on by Daniel",
      "Anything the Project Officer has not recorded, reported or escalated to her",
    ],
    contactConditions: [
      "Sends the weekly welcome and briefing emails",
      "Follows up when a task is overdue or a decision looks unsupported",
      "Responds within the same working day to a properly addressed escalation",
    ],
    approvalBoundaries: [
      "Can approve day-to-day task priorities and minor plan adjustments",
      "Cannot authorise budget changes or the go-live decision alone — those go to the Project Board",
    ],
    avatarInitials: "SM",
  },
  {
    id: "lucy-thompson",
    name: "Lucy Thompson",
    roleTitle: "Clinical Product Owner",
    authorityLevel:
      "Owns the requirements backlog on behalf of patients and clinical operations; can request changes but cannot approve extra budget or timeline.",
    responsibilities: [
      "Represents patient and clinical-operations needs",
      "Prioritises and clarifies requirements",
      "Signs off that a feature meets the operational need",
    ],
    communicationStyle:
      "Practical and outcome-focused. Speaks in terms of patient and staff impact rather than technical detail; pushes back if a proposal adds staff burden.",
    knows: [
      "Current appointment-booking pain points reported by clinical teams",
      "Which requirements are firm and which are still under discussion",
    ],
    doesNotKnow: [
      "Technical build detail and integration constraints (that's Daniel's area)",
      "Test results until Rachel's team reports them",
    ],
    contactConditions: [
      "Attends the requirements meeting",
      "Emails when a requirement needs clarifying or a new request comes in from clinical operations",
    ],
    approvalBoundaries: [
      "Can approve requirement wording and priority within the agreed scope",
      "Cannot approve scope additions that affect budget or timeline without Sarah and the Board",
    ],
    avatarInitials: "LT",
  },
  {
    id: "daniel-reed",
    name: "Daniel Reed",
    roleTitle: "Technical Lead",
    authorityLevel:
      "Owns technical delivery decisions and defect triage; escalates anything with security, privacy or scope implications to Sarah and James.",
    responsibilities: [
      "Leads the development team building the portal",
      "Reports progress, blockers and technical risk",
      "Triages defects with Rachel's testing team",
    ],
    communicationStyle:
      "Precise and slightly terse in writing; explains technical issues in plain terms when asked, and is candid about what is and isn't fixed yet.",
    knows: [
      "Build and integration status, defect causes and fix estimates",
      "Which defects are cosmetic and which touch data handling",
    ],
    doesNotKnow: [
      "Clinical operational impact of a change unless Lucy explains it",
      "Whether something is a reportable privacy incident — that judgement sits with James",
    ],
    contactConditions: [
      "Sends the development status update",
      "Replies to direct technical questions about defects or delivery risk",
    ],
    approvalBoundaries: [
      "Can approve technical implementation choices within agreed scope",
      "Cannot decide launch readiness alone — that is a joint Sarah/Rachel/James recommendation to the Board",
    ],
    avatarInitials: "DR",
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    roleTitle: "UX Designer",
    authorityLevel:
      "Owns usability and accessibility recommendations; cannot override a delivery date on her own authority.",
    responsibilities: [
      "Designs and tests the patient-facing interface",
      "Raises usability and accessibility issues",
      "Feeds user research into requirements discussions",
    ],
    communicationStyle: "Collaborative and evidence-based; illustrates points with what she observed in testing rather than opinion.",
    knows: [
      "Usability testing findings, including the mobile issue found in this scenario",
      "Accessibility requirements the portal needs to meet",
    ],
    doesNotKnow: ["Backend causes of defects — she reports symptoms, Daniel diagnoses causes"],
    contactConditions: ["Contributes to the testing report", "Flags usability concerns as they arise"],
    approvalBoundaries: ["Can approve design changes within the agreed design system", "Cannot approve scope or schedule changes"],
    avatarInitials: "MP",
  },
  {
    id: "rachel-adams",
    name: "Rachel Adams",
    roleTitle: "Test Lead",
    authorityLevel:
      "Owns the test plan, defect log and evidence for go-live readiness; recommends but does not decide launch readiness alone.",
    responsibilities: [
      "Plans and runs functional and usability testing",
      "Logs, classifies and tracks defects to closure",
      "Provides the evidence base for the go/no-go recommendation",
    ],
    communicationStyle: "Methodical and factual; reports severity and evidence rather than opinion, and expects the same discipline back from the Project Officer.",
    knows: [
      "Every defect found in this test cycle and its severity",
      "What has and has not yet been retested",
    ],
    doesNotKnow: ["Whether a defect is a reportable privacy incident under policy — that decision sits with James Wilson"],
    contactConditions: ["Publishes the software-testing report", "Responds to questions about defect severity or evidence"],
    approvalBoundaries: ["Can approve the test approach and defect severity classification", "Cannot approve launch on her own — recommends only"],
    avatarInitials: "RA",
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    roleTitle: "Information Governance Lead",
    authorityLevel:
      "Owns the decision on whether something is a reportable data-protection incident and what containment is required; escalates serious incidents to Dr Amelia Grant.",
    responsibilities: [
      "Reviews privacy, information-security and data-handling risks",
      "Decides whether an issue meets the threshold for a data-protection incident",
      "Directs containment and required notifications",
    ],
    communicationStyle: "Calm, precise and process-driven. Asks for specifics — what was exposed, to whom, for how long — before advising, and is firm that unclear or unescalated privacy risks are unacceptable.",
    knows: [
      "The organisation's data-protection policy and incident thresholds",
      "Anything formally escalated to him about a possible privacy issue",
    ],
    doesNotKnow: ["Details of a privacy-relevant defect until someone reports it to him — he does not monitor the defect log directly"],
    contactConditions: [
      "Responds when a potential privacy or data-handling issue is escalated to him",
      "Does not appear in the scenario until a privacy concern is raised",
    ],
    approvalBoundaries: [
      "Can require that a defect be fixed and verified before launch on data-protection grounds",
      "Cannot authorise the wider go-live decision alone — that is the Board's, informed by his advice",
    ],
    avatarInitials: "JW",
  },
  {
    id: "sophie-clark",
    name: "Sophie Clark",
    roleTitle: "Project Support Officer",
    authorityLevel: "Administrative support only; no approval authority.",
    responsibilities: [
      "Maintains shared project records and the document library",
      "Circulates agendas, minutes and actions",
      "Models good administrative practice for the Project Officer",
    ],
    communicationStyle: "Friendly, organised and helpful; a good first point of contact for 'how do things work here' questions.",
    knows: ["Where project records live and how the team's admin conventions work"],
    doesNotKnow: ["Technical, clinical or governance detail outside her admin role"],
    contactConditions: ["Sends practical onboarding information", "Available for process questions"],
    approvalBoundaries: ["Cannot approve any project decision"],
    avatarInitials: "SC",
  },
  {
    id: "amelia-grant",
    name: "Dr Amelia Grant",
    roleTitle: "Project Executive",
    authorityLevel:
      "Chairs the Project Board; makes the final investment and go-live decisions on the Board's recommendation.",
    responsibilities: [
      "Owns the business case and overall project outcome",
      "Makes major investment, scope and go-live decisions",
      "Is briefed on serious risks and incidents by Sarah and James",
    ],
    communicationStyle: "Measured and outcome-focused; engages directly only when a decision needs her authority.",
    knows: ["Headline project status and any risk or incident escalated to Board level"],
    doesNotKnow: ["Day-to-day task detail unless it is escalated to her"],
    contactConditions: ["Only appears when a decision requires Project Board authority, such as the go-live recommendation"],
    approvalBoundaries: [
      "Can approve funding, major scope changes and the go-live decision",
      "Delegates all delivery detail to Sarah and the team",
    ],
    avatarInitials: "AG",
  },
];

export function getCharacter(id: string): Character {
  const character = CHARACTERS.find((c) => c.id === id);
  if (!character) {
    throw new Error(`Unknown character: ${id}`);
  }
  return character;
}
