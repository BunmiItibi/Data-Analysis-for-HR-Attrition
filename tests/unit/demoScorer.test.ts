import { describe, expect, it } from "vitest";
import { scoreSubmissionDemo, buildDemoManagerNote } from "@/lib/assessment/demoScorer";
import type { SubmissionContent } from "@/lib/domain/types";

describe("scoreSubmissionDemo — requirements-summary", () => {
  const good: SubmissionContent = {
    taskCode: "requirements-summary",
    data: {
      summary: "The meeting confirmed the 24-hour cancellation notice period is in scope, and address changes stay out of scope for this release.",
      decisions: ["The 24-hour cancellation notice period is confirmed as in scope for this release."],
      actions: [
        { action: "Build the notice-period check", owner: "Daniel Reed", dueDate: "In 3 days" },
        { action: "Write up the mobile usability finding", owner: "Maya Patel", dueDate: "Tomorrow" },
      ],
      openQuestions: [],
    },
  };

  it("scores well-formed, accurate summaries highly", () => {
    const results = scoreSubmissionDemo(good);
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(4);
      expect(r.humanReviewFlag).toBe(false);
      expect(r.safetyFlag).toBe(false);
    }
  });

  it("penalises a summary that misrepresents the mobile usability point as a decision", () => {
    const bad: SubmissionContent = {
      taskCode: "requirements-summary",
      data: {
        summary: "ok",
        decisions: ["We decided to fix the mobile cancel button issue"],
        actions: [],
        openQuestions: [],
      },
    };
    const results = scoreSubmissionDemo(bad);
    const organisation = results.find((r) => r.competency === "project_organisation")!;
    expect(organisation.score).toBeLessThanOrEqual(2);
  });
});

describe("scoreSubmissionDemo — raid-log", () => {
  it("rewards full RAID coverage with owners and impact ratings", () => {
    const content: SubmissionContent = {
      taskCode: "raid-log",
      data: {
        entries: [
          { id: "1", type: "risk", description: "Scope creep risk on the notice-period change", owner: "Daniel Reed", impact: "high", mitigation: "Daniel to prioritise and confirm timing with Rachel before the next cycle", status: "open" },
          { id: "2", type: "issue", description: "Reminder email lag under load", owner: "Daniel Reed", impact: "medium", mitigation: "Accepted as a known limitation, monitored post-launch", status: "monitoring" },
          { id: "3", type: "assumption", description: "Most patients use mobile devices", owner: "Lucy Thompson", impact: "low", mitigation: "Validated by usability testing", status: "closed" },
          { id: "4", type: "dependency", description: "Depends on the appointments system integration remaining stable", owner: "Daniel Reed", impact: "medium", mitigation: "Daniel to confirm no breaking changes planned", status: "open" },
        ],
      },
    };
    const results = scoreSubmissionDemo(content);
    const coverage = results.find((r) => r.competency === "risk_and_issue_management")!;
    expect(coverage.score).toBe(5);
  });

  it("penalises missing RAID categories", () => {
    const content: SubmissionContent = {
      taskCode: "raid-log",
      data: {
        entries: [{ id: "1", type: "risk", description: "Some risk", owner: "", impact: "low", mitigation: "", status: "open" }],
      },
    };
    const results = scoreSubmissionDemo(content);
    const coverage = results.find((r) => r.competency === "risk_and_issue_management")!;
    expect(coverage.score).toBeLessThan(5);
  });

  it("penalises high-impact entries with a thin mitigation", () => {
    const content: SubmissionContent = {
      taskCode: "raid-log",
      data: {
        entries: [
          { id: "1", type: "risk", description: "Something serious", owner: "Daniel", impact: "high", mitigation: "watch it", status: "open" },
        ],
      },
    };
    const results = scoreSubmissionDemo(content);
    const judgement = results.find((r) => r.competency === "professional_judgement")!;
    expect(judgement.score).toBeLessThanOrEqual(2);
  });
});

describe("scoreSubmissionDemo — escalation-recommendation (privacy-critical)", () => {
  const escalatedProperly: SubmissionContent = {
    taskCode: "escalation-recommendation",
    data: {
      incidentSummary: "One patient occasionally saw another patient's appointment reference during concurrent-session testing, reproduced twice in around 40 runs.",
      severityAssessment: "Low reproduction rate but a genuine cross-patient exposure of a reference number in a concurrent session, which is a real data-protection concern.",
      peopleNotified: ["James Wilson", "Sarah Mitchell"],
      recommendation: "I recommend the launch does not proceed until the session-cache defect is fixed and retested under concurrent load. This is my recommendation for Sarah and the Board — also noting the confirmation email delay, mobile cancel button, browser time display and incomplete training findings.",
      launchReadiness: "conditional",
      conditions: "Fix and retest the session-cache defect before go-live.",
    },
  };

  const notEscalated: SubmissionContent = {
    taskCode: "escalation-recommendation",
    data: {
      incidentSummary: "A minor defect was found in testing.",
      severityAssessment: "Not a big deal, low priority.",
      peopleNotified: ["Daniel Reed"],
      recommendation: "I recommend we go live as planned.",
      launchReadiness: "ready",
    },
  };

  it("scores the data-protection-awareness competency highly when James Wilson (IG) is notified", () => {
    const results = scoreSubmissionDemo(escalatedProperly);
    const dpa = results.find((r) => r.competency === "data_protection_awareness")!;
    expect(dpa.score).toBeGreaterThanOrEqual(4);
    expect(dpa.safetyFlag).toBe(false);
  });

  it("raises a safety flag when the privacy issue is not escalated to Information Governance", () => {
    const results = scoreSubmissionDemo(notEscalated);
    const dpa = results.find((r) => r.competency === "data_protection_awareness")!;
    expect(dpa.score).toBe(1);
    expect(dpa.safetyFlag).toBe(true);
  });

  it("always flags every escalation-recommendation competency for human review — this task is privacy-related", () => {
    for (const content of [escalatedProperly, notEscalated]) {
      const results = scoreSubmissionDemo(content);
      expect(results.every((r) => r.humanReviewFlag)).toBe(true);
    }
  });

  it("never awards an unexplained score — every competency result carries evidence, strength, gap and improvement", () => {
    for (const content of [escalatedProperly, notEscalated]) {
      const results = scoreSubmissionDemo(content);
      for (const r of results) {
        expect(r.evidence.length).toBeGreaterThan(0);
        expect(r.strength.length).toBeGreaterThan(0);
        expect(r.gap.length).toBeGreaterThan(0);
        expect(r.improvement.length).toBeGreaterThan(0);
      }
    }
  });

  it("penalises a recommendation that oversteps into the Project Board's go-live decision", () => {
    const overstepping: SubmissionContent = {
      taskCode: "escalation-recommendation",
      data: {
        ...escalatedProperly.data,
        recommendation: "I have decided we go live regardless — I approve the launch.",
      },
    };
    const results = scoreSubmissionDemo(overstepping);
    const judgement = results.find((r) => r.competency === "professional_judgement")!;
    expect(judgement.score).toBeLessThanOrEqual(2);
  });
});

describe("buildDemoManagerNote", () => {
  it("produces a non-empty, structured manager note referencing the weakest competency", () => {
    const content: SubmissionContent = {
      taskCode: "raid-log",
      data: { entries: [] },
    };
    const assessments = scoreSubmissionDemo(content);
    const note = buildDemoManagerNote(content, assessments);
    expect(note.length).toBeGreaterThan(20);
    expect(note).toContain("What needs improvement");
  });
});
