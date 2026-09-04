import { describe, expect, it } from "vitest";
import { computeNextAction } from "@/lib/dashboard";
import type { Enrollment, Submission } from "@/lib/domain/types";

function baseEnrollment(overrides: Partial<Enrollment> = {}): Enrollment {
  return {
    id: "e1",
    userId: "u1",
    experienceId: "exp1",
    state: "active",
    stage: "briefing",
    appliedAt: null,
    offeredAt: null,
    acceptedAt: null,
    completedAt: null,
    inductionCompletedItemIds: [],
    scenarioFlags: {},
    ...overrides,
  };
}

describe("computeNextAction", () => {
  it("sends the learner to induction while stage is induction", () => {
    const action = computeNextAction(baseEnrollment({ stage: "induction" }), [], false);
    expect(action.href).toBe("/induction");
  });

  it("sends the learner to the inbox to read the welcome email before it's been replied to", () => {
    const action = computeNextAction(baseEnrollment({ stage: "briefing" }), [], false);
    expect(action.href).toBe("/inbox");
  });

  it("sends the learner to the requirements meeting once the welcome email is replied to", () => {
    const action = computeNextAction(baseEnrollment({ stage: "briefing" }), [], true);
    expect(action.href).toBe("/meetings/requirements-meeting");
  });

  it("sends the learner to the requirements-summary task while it's unfinished", () => {
    const action = computeNextAction(baseEnrollment({ stage: "requirements_meeting" }), [], true);
    expect(action.href).toBe("/tasks/requirements-summary");
  });

  it("sends the learner to the RAID log once the requirements summary is finalised", () => {
    const submissions: Submission[] = [
      {
        id: "s1",
        enrollmentId: "e1",
        taskCode: "requirements-summary",
        status: "feedback_available",
        versions: [],
        createdAt: "",
        updatedAt: "",
      },
    ];
    const action = computeNextAction(baseEnrollment({ stage: "requirements_meeting" }), submissions, true);
    expect(action.href).toBe("/tasks/raid-log");
  });

  it("sends the learner to review feedback that's waiting during the review stage", () => {
    const submissions: Submission[] = [
      { id: "s1", enrollmentId: "e1", taskCode: "requirements-summary", status: "feedback_available", versions: [], createdAt: "", updatedAt: "" },
      { id: "s2", enrollmentId: "e1", taskCode: "raid-log", status: "resubmitted", versions: [], createdAt: "", updatedAt: "" },
      { id: "s3", enrollmentId: "e1", taskCode: "escalation-recommendation", status: "resubmitted", versions: [], createdAt: "", updatedAt: "" },
    ];
    const action = computeNextAction(baseEnrollment({ stage: "review" }), submissions, true);
    expect(action.href).toBe("/submissions/requirements-summary/feedback");
  });

  it("sends the learner to the score page once nothing is pending in review", () => {
    const submissions: Submission[] = [
      { id: "s1", enrollmentId: "e1", taskCode: "requirements-summary", status: "resubmitted", versions: [], createdAt: "", updatedAt: "" },
      { id: "s2", enrollmentId: "e1", taskCode: "raid-log", status: "resubmitted", versions: [], createdAt: "", updatedAt: "" },
      { id: "s3", enrollmentId: "e1", taskCode: "escalation-recommendation", status: "resubmitted", versions: [], createdAt: "", updatedAt: "" },
    ];
    const action = computeNextAction(baseEnrollment({ stage: "review" }), submissions, true);
    expect(action.href).toBe("/score");
  });

  it("sends a completed learner to the portfolio", () => {
    const action = computeNextAction(baseEnrollment({ stage: "completed" }), [], true);
    expect(action.href).toBe("/portfolio");
  });
});
