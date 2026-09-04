export type DefectSeverity = "low" | "medium" | "high" | "critical";

export interface Defect {
  id: string;
  title: string;
  severity: DefectSeverity;
  description: string;
  evidence: string;
  isPrivacyRelevant: boolean;
}

/**
 * The build prompt specifies this exact set of findings, including the
 * serious cross-patient privacy defect that must be recognised and escalated.
 */
export const TESTING_REPORT: {
  cycle: string;
  summary: string;
  defects: Defect[];
} = {
  cycle: "Cycle 3 — pre-go-live regression and usability pass",
  summary:
    "Five findings from this cycle. Four are routine defects of varying severity. One — the appointment-reference issue below — needs your full attention before anyone recommends going live.",
  defects: [
    {
      id: "defect-confirmation-delay",
      title: "Confirmation emails delayed under load",
      severity: "medium",
      description:
        "Confirmation emails are taking up to 40 minutes to arrive during peak testing load, against a target of under 5 minutes. Reminders on the same queue show the same lag.",
      evidence:
        "Logged 12 confirmation emails sent between 14:00–14:30 during load testing; average delivery time 27 minutes, worst case 41 minutes. Matches the known shared-queue limitation Daniel flagged before this cycle.",
      isPrivacyRelevant: false,
    },
    {
      id: "defect-mobile-usability",
      title: "Cancel button hard to find on mobile",
      severity: "medium",
      description:
        "On phone-sized screens, the cancel action sits below the fold and was missed by most test participants in this cycle, consistent with Maya's earlier usability finding.",
      evidence:
        "4 of 6 test participants using a phone-sized viewport did not locate the cancel option within 60 seconds without assistance.",
      isPrivacyRelevant: false,
    },
    {
      id: "defect-browser-times",
      title: "Incorrect appointment times shown in one browser",
      severity: "medium",
      description:
        "Appointment times display one hour earlier than the correct time when viewed in one specific browser, consistent with a timezone-handling bug isolated to that browser's date parsing.",
      evidence:
        "Reproduced on 8 of 8 attempts in the affected browser; times display correctly in the other two browsers tested.",
      isPrivacyRelevant: false,
    },
    {
      id: "defect-staff-training",
      title: "Reception staff training incomplete",
      severity: "low",
      description:
        "Only 2 of 6 reception staff have completed training on the new portal's cancellation workflow ahead of go-live.",
      evidence: "Training completion tracker: 2 of 6 staff signed off as of the end of this test cycle.",
      isPrivacyRelevant: false,
    },
    {
      id: "defect-cross-patient-reference",
      title: "One patient can occasionally see another patient's appointment reference",
      severity: "critical",
      description:
        "In intermittent conditions during concurrent-session testing, the appointment confirmation screen has displayed the appointment reference number belonging to a different patient's session instead of the current user's own. It reproduced in 2 of around 40 concurrent-session test runs — a low but non-zero rate — and appears linked to how the session cache handles two appointment lookups arriving at nearly the same time.",
      evidence:
        "Reproduced twice during concurrent load testing (test IDs LOAD-114 and LOAD-131): Patient Session A's screen displayed an appointment reference matching Patient Session B's booking. No other patient details (name, contact details, clinical information) were shown in either reproduction — the exposure observed is limited to the appointment reference number. Root cause not yet confirmed; Daniel's team suspects a session-cache key collision under concurrent load.",
      isPrivacyRelevant: true,
    },
  ],
};

export function getDefect(id: string): Defect {
  const defect = TESTING_REPORT.defects.find((d) => d.id === id);
  if (!defect) {
    throw new Error(`Unknown defect: ${id}`);
  }
  return defect;
}
