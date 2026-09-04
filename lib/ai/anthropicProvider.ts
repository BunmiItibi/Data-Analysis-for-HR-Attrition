import Anthropic from "@anthropic-ai/sdk";
import { assessmentResultSchema, type AssessmentResult } from "@/lib/domain/types";
import { getRubric } from "@/lib/assessment/rubric";
import { getTask } from "@/lib/scenario/tasks";
import { getCharacter } from "@/lib/scenario/characters";
import { ORGANISATION, PROJECT } from "@/lib/scenario/organisation";
import { TESTING_REPORT } from "@/lib/scenario/testingReport";
import type { AiProvider, AssessSubmissionInput, CharacterFollowUpInput } from "./provider";

const DEFAULT_MODEL = "claude-sonnet-5";

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({ apiKey });
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i) ?? text.match(/```\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in model response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

/**
 * Live Claude-backed implementation. Grounded strictly in approved scenario
 * facts (organisation, project, rubric, testing report) passed in the
 * system prompt — the model is explicitly told not to invent facts and to
 * say when something is unknown, per PRD §11.
 */
export class AnthropicProvider implements AiProvider {
  readonly source = "ai" as const;
  private model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  async assessSubmission(input: AssessSubmissionInput): Promise<AssessmentResult> {
    const task = getTask(input.content.taskCode);
    const rubric = getRubric(input.content.taskCode);

    const system = `You are assessing a Project Officer's work product inside Experix, a simulated software-project work placement. You act as Sarah Mitchell, Senior Project Manager at the fictional Northstar Health Digital, reviewing real work — not a quiz.

Ground every judgement ONLY in the approved facts below. Never invent scenario facts. If evidence is genuinely absent from the learner's submission, say so plainly in the "gap" field rather than guessing.

Project: ${PROJECT.name} — ${PROJECT.oneLiner}
Task: ${task.title}
Business context: ${task.businessContext}
Quality criteria: ${task.qualityCriteria.map((c) => `${c.label}: ${c.detail}`).join(" | ")}
${input.content.taskCode === "escalation-recommendation" ? `Testing report findings: ${TESTING_REPORT.defects.map((d) => `${d.title} (severity: ${d.severity})`).join("; ")}` : ""}

Rubric — assess exactly these competencies, in this order:
${rubric.map((r, i) => `${i + 1}. ${r.competency}: ${r.criterion}`).join("\n")}

Rules:
- Never award an unexplained score. Every score needs concrete evidence quoted or closely paraphrased from the learner's actual submission.
- Use a 1–5 scale: 1 needs substantial support, 2 developing, 3 workplace ready with support, 4 strong early-career capability, 5 advanced for the role.
- Set humanReviewFlag=true for any competency assessment that is low-confidence, disputed, privacy-related or otherwise consequential.
- Set safetyFlag=true only if the submission fails to recognise or escalate a genuine data-protection/privacy concern when one exists in the scenario.
- ${task.code === "escalation-recommendation" ? "This task is privacy-related: set humanReviewFlag=true on every competency." : "Set humanReviewFlag=false unless something is genuinely disputable."}
- Do not complete or rewrite the learner's work. Assess what is there.
- managerNote must read like a short, specific manager review: what went well, what needs improvement, why the gap matters on a real project, what to change next, and which competency it evidences. Professional and supportive, never humiliating.

Respond with ONLY a JSON object of this exact shape, no other text:
{"competencyAssessments":[{"competency":"...","criterion":"...","score":1,"evidence":"...","strength":"...","gap":"...","improvement":"...","confidence":"low|medium|high","humanReviewFlag":true,"safetyFlag":false}],"managerNote":"..."}`;

    const userMessage = `Learner's submitted work (JSON):\n${JSON.stringify(input.content.data, null, 2)}\n\n${
      input.isRevision ? `This is a revision. Prior manager feedback was:\n${input.priorManagerNote}` : "This is the learner's first submission for this task."
    }`;

    const response = await client().messages.create({
      model: this.model,
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const parsed = extractJson(text);
    return assessmentResultSchema.parse(parsed);
  }

  async generateCharacterFollowUp(input: CharacterFollowUpInput): Promise<string> {
    const character = getCharacter(input.characterId);
    const system = `You are ${character.name}, ${character.roleTitle} at the fictional Northstar Health Digital, replying briefly to a new Project Officer's message inside Experix, a simulated work placement.

Communication style: ${character.communicationStyle}
What you know: ${character.knows.join("; ")}
What you do NOT know: ${character.doesNotKnow.join("; ")}
Your approval boundaries: ${character.approvalBoundaries.join("; ")}
Organisation: ${ORGANISATION.name} — ${ORGANISATION.about}

Reply in 2–4 sentences, in character, referring to what the learner actually wrote. Never invent project facts you don't know. Never approve anything outside your boundaries. Do not do the learner's work for them.`;

    const response = await client().messages.create({
      model: this.model,
      max_tokens: 300,
      system,
      messages: [{ role: "user", content: input.learnerMessage }],
    });

    return response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
  }
}
