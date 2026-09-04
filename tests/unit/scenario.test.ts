import { describe, expect, it } from "vitest";
import { CHARACTERS, COMMUNICATIONS, TASKS, getCharacter } from "@/lib/scenario";
import { TESTING_REPORT } from "@/lib/scenario/testingReport";
import { REQUIREMENTS_MEETING } from "@/lib/scenario/meetings";
import { INDUCTION_ITEMS } from "@/lib/scenario/placement";
import { COMPETENCIES, INDUCTION_ITEM_IDS } from "@/lib/domain/types";
import { getRubric } from "@/lib/assessment/rubric";

describe("scenario content integrity", () => {
  it("every communication references a real character", () => {
    for (const c of COMMUNICATIONS) {
      expect(() => getCharacter(c.fromCharacterId)).not.toThrow();
    }
  });

  it("defines all eight named Northstar characters from the PRD", () => {
    const names = CHARACTERS.map((c) => c.name).sort();
    expect(names).toEqual(
      [
        "Sarah Mitchell",
        "Lucy Thompson",
        "Daniel Reed",
        "Maya Patel",
        "Rachel Adams",
        "James Wilson",
        "Sophie Clark",
        "Dr Amelia Grant",
      ].sort(),
    );
  });

  it("every character has all required knowledge-boundary fields populated", () => {
    for (const c of CHARACTERS) {
      expect(c.knows.length).toBeGreaterThan(0);
      expect(c.doesNotKnow.length).toBeGreaterThan(0);
      expect(c.contactConditions.length).toBeGreaterThan(0);
      expect(c.approvalBoundaries.length).toBeGreaterThan(0);
    }
  });

  it("every task's competencies are valid, recognised competencies", () => {
    for (const task of TASKS) {
      for (const c of task.competencies) {
        expect(COMPETENCIES).toContain(c);
      }
    }
  });

  it("every task has a rubric covering each of its declared competencies", () => {
    for (const task of TASKS) {
      const rubric = getRubric(task.code);
      const rubricCompetencies = rubric.map((r) => r.competency);
      for (const c of task.competencies) {
        expect(rubricCompetencies).toContain(c);
      }
    }
  });

  it("the testing report contains exactly the five required findings, including the critical privacy defect", () => {
    expect(TESTING_REPORT.defects).toHaveLength(5);
    const titles = TESTING_REPORT.defects.map((d) => d.title.toLowerCase());
    expect(titles.some((t) => t.includes("confirmation"))).toBe(true);
    expect(titles.some((t) => t.includes("mobile"))).toBe(true);
    expect(titles.some((t) => t.includes("browser"))).toBe(true);
    expect(titles.some((t) => t.includes("training"))).toBe(true);

    const privacyDefect = TESTING_REPORT.defects.find((d) => d.isPrivacyRelevant);
    expect(privacyDefect).toBeDefined();
    expect(privacyDefect!.severity).toBe("critical");
  });

  it("the requirements meeting transcript supports the decisions it claims were made", () => {
    expect(REQUIREMENTS_MEETING.decisions.length).toBeGreaterThan(0);
    expect(REQUIREMENTS_MEETING.actions.length).toBeGreaterThan(0);
    const transcriptText = REQUIREMENTS_MEETING.transcript.map((t) => t.line).join(" ");
    expect(transcriptText).toContain("24 hours");
  });

  it("induction covers exactly the required induction item ids", () => {
    const ids = INDUCTION_ITEMS.map((i) => i.id).sort();
    expect(ids).toEqual([...INDUCTION_ITEM_IDS].sort());
  });
});
