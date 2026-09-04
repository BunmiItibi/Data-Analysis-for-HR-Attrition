import { assessmentResultSchema, type AssessmentResult } from "@/lib/domain/types";
import { buildDemoManagerNote, scoreSubmissionDemo } from "@/lib/assessment/demoScorer";
import { getCharacter } from "@/lib/scenario/characters";
import type { AiProvider, AssessSubmissionInput, CharacterFollowUpInput } from "./provider";

export class DemoProvider implements AiProvider {
  readonly source = "demo" as const;

  async assessSubmission(input: AssessSubmissionInput): Promise<AssessmentResult> {
    const competencyAssessments = scoreSubmissionDemo(input.content);
    const managerNote = buildDemoManagerNote(input.content, competencyAssessments);
    return assessmentResultSchema.parse({ competencyAssessments, managerNote });
  }

  async generateCharacterFollowUp(input: CharacterFollowUpInput): Promise<string> {
    const character = getCharacter(input.characterId);
    const mentionsGoal = input.learnerCareerGoal ? `, and noted you're working towards ${input.learnerCareerGoal.toLowerCase()}` : "";
    if (character.id === "sarah-mitchell") {
      return `Thanks for the introduction${mentionsGoal} — good to have you on the team. I'll get you into the project briefing next; shout if anything's unclear as you go.`;
    }
    return `Thanks for letting me know — ${character.name.split(" ")[0]}`;
  }
}
