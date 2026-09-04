export const ORGANISATION = {
  name: "Northstar Health Digital",
  tagline: "A fictional healthcare technology team, created for Experix simulated work placements.",
  about:
    "Northstar Health Digital is a fictional digital delivery team that builds patient-facing software for community healthcare services. Northstar is not a real organisation and has no connection to the NHS or any real healthcare provider.",
  structure: [
    "Project Board (Executive oversight, chaired by the Project Executive)",
    "Delivery team (Project Manager, Project Officer, Project Support Officer)",
    "Product and design (Clinical Product Owner, UX Designer)",
    "Engineering and quality (Technical Lead, developers, Test Lead)",
    "Governance (Information Governance Lead)",
  ],
  values: [
    "Patients and staff before process — every requirement should trace back to a real need.",
    "Say it early — problems raised promptly are cheap; problems hidden are expensive.",
    "Evidence over opinion — decisions are backed by what was observed, not assumed.",
    "Protect what people share with us — data handling is everyone's responsibility, not just Information Governance's.",
  ],
  glossary: [
    { term: "RAID log", definition: "A record of project Risks, Assumptions, Issues and Dependencies." },
    { term: "Go-live", definition: "The point at which a system is released for real use." },
    { term: "Project Board", definition: "The senior group with authority to approve funding, scope and go-live." },
    { term: "Information governance (IG)", definition: "The rules and practice for handling information, including personal data, safely and lawfully." },
    { term: "Severity", definition: "How serious a defect's impact is, independent of how easy it is to fix." },
    { term: "Defect", definition: "A difference between what the software should do and what it actually does." },
  ],
  conductPolicy: [
    "Be accurate: record what actually happened, not what you assume happened.",
    "Escalate promptly: a risk or concern raised a day late is harder to contain than one raised immediately.",
    "Respect authority boundaries: the Project Officer supports and recommends, and flags decisions that need the Project Manager or Board.",
    "Protect information: never share more than someone needs to do their job, and never use real patient or personal data in any project material.",
  ],
  dataProtectionNotice:
    "This is a simulated workplace. Do not upload, paste or reference any real patient, NHS, employer or otherwise confidential information anywhere in Experix — including in emails, tasks, uploads or free-text answers. Use only the fictional Northstar scenario details provided to you.",
} as const;

export const PROJECT = {
  name: "Northstar Patient Access Portal",
  oneLiner:
    "A secure web portal so patients can view, change and cancel appointments, and receive confirmations and reminders.",
  problem:
    "Patients currently have to phone the clinic to check, change or cancel an appointment. Phone lines are busy at peak times, appointments are sometimes missed because reminders are inconsistent, and staff spend a large share of their day on routine booking calls that add no clinical value.",
  objectives: [
    "Let patients view their upcoming appointments online, at any time",
    "Let patients request a change or cancellation without phoning the clinic",
    "Send automatic confirmations and reminders to reduce missed appointments",
    "Reduce routine phone volume so staff time shifts toward higher-value work",
  ],
  scope: [
    "In scope: appointment viewing, change requests, cancellation, confirmations, reminders, basic contact-detail updates",
    "Out of scope for this release: online booking of new appointments, clinical messaging, payments",
  ],
  benefits: [
    "Fewer missed appointments through automatic reminders",
    "Reduced call-handling time for reception staff",
    "Patients can self-serve simple changes outside clinic opening hours",
  ],
  timeline: "Four-week delivery sprint culminating in a go-live readiness decision by the Project Board.",
  budgetAssumption:
    "Fixed delivery budget already approved by the Project Board; any scope addition needs a Board-level change request.",
  constraints: [
    "Must work well on mobile devices, since most patients will access it on a phone",
    "Must meet the organisation's data-protection and accessibility standards",
    "Must integrate with the existing appointments system without disrupting it",
  ],
} as const;
