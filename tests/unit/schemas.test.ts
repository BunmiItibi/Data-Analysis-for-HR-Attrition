import { describe, expect, it } from "vitest";
import {
  registerInputSchema,
  loginInputSchema,
  experienceProfileInputSchema,
  submissionContentSchema,
  assessmentResultSchema,
} from "@/lib/domain/types";

describe("registerInputSchema", () => {
  it("accepts valid input", () => {
    const result = registerInputSchema.safeParse({
      fullName: "Bunmi Adebayo",
      email: "bunmi@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = registerInputSchema.safeParse({
      fullName: "Bunmi Adebayo",
      email: "bunmi@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerInputSchema.safeParse({
      fullName: "Bunmi Adebayo",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginInputSchema", () => {
  it("rejects an empty password", () => {
    const result = loginInputSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("experienceProfileInputSchema", () => {
  it("requires at least one development priority", () => {
    const result = experienceProfileInputSchema.safeParse({
      careerGoal: "Become a project officer",
      currentSituation: "No experience yet",
      developmentPriorities: [],
    });
    expect(result.success).toBe(false);
  });

  it("caps development priorities at five", () => {
    const result = experienceProfileInputSchema.safeParse({
      careerGoal: "Become a project officer",
      currentSituation: "No experience yet",
      developmentPriorities: ["a", "b", "c", "d", "e", "f"],
    });
    expect(result.success).toBe(false);
  });
});

describe("submissionContentSchema", () => {
  it("validates a well-formed RAID log", () => {
    const result = submissionContentSchema.safeParse({
      taskCode: "raid-log",
      data: {
        entries: [
          { id: "1", type: "risk", description: "desc", owner: "Owner", impact: "high", mitigation: "mit", status: "open" },
        ],
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown task code", () => {
    const result = submissionContentSchema.safeParse({
      taskCode: "not-a-real-task",
      data: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects a RAID entry with an invalid type", () => {
    const result = submissionContentSchema.safeParse({
      taskCode: "raid-log",
      data: {
        entries: [{ id: "1", type: "not-a-type", description: "desc", owner: "o", impact: "low", mitigation: "", status: "open" }],
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("assessmentResultSchema", () => {
  it("requires competencyAssessments and a managerNote", () => {
    const result = assessmentResultSchema.safeParse({ competencyAssessments: [], managerNote: "note" });
    expect(result.success).toBe(false); // min(1) on competencyAssessments
  });

  it("accepts a well-formed assessment result", () => {
    const result = assessmentResultSchema.safeParse({
      managerNote: "Good work overall.",
      competencyAssessments: [
        {
          competency: "professional_judgement",
          criterion: "Some criterion",
          score: 4,
          evidence: "evidence",
          strength: "strength",
          gap: "gap",
          improvement: "improvement",
          confidence: "medium",
          humanReviewFlag: false,
          safetyFlag: false,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a score outside the 1–5 range", () => {
    const result = assessmentResultSchema.safeParse({
      managerNote: "note",
      competencyAssessments: [
        {
          competency: "professional_judgement",
          criterion: "c",
          score: 7,
          evidence: "e",
          strength: "s",
          gap: "g",
          improvement: "i",
          confidence: "medium",
          humanReviewFlag: false,
          safetyFlag: false,
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});
