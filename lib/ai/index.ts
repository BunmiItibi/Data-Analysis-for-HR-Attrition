import type { AssessmentResult } from "@/lib/domain/types";
import { DemoProvider } from "./demoProvider";
import type { AiProvider, AssessSubmissionInput, CharacterFollowUpInput } from "./provider";

const demo = new DemoProvider();

let live: AiProvider | null = null;
function liveProvider(): AiProvider | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!live) {
    // Lazy require, not `import`: keeps the Anthropic SDK out of the bundle
    // for demo-mode requests that never touch it.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AnthropicProvider } = require("./anthropicProvider") as typeof import("./anthropicProvider");
    live = new AnthropicProvider();
  }
  return live;
}

export function isDemoAiMode(): boolean {
  return !process.env.ANTHROPIC_API_KEY;
}

/**
 * Resilient wrapper: prefers the live Anthropic provider when configured,
 * but falls back to the deterministic demo provider if the live call
 * throws (missing key, network error, malformed model output) so a single
 * upstream failure never breaks the learner's journey. The result always
 * carries which provider actually produced it.
 */
class ResilientAiProvider implements AiProvider {
  get source(): "ai" | "demo" {
    return liveProvider() ? "ai" : "demo";
  }

  async assessSubmission(input: AssessSubmissionInput): Promise<AssessmentResult & { source: "ai" | "demo" }> {
    const provider = liveProvider();
    if (provider) {
      try {
        const result = await provider.assessSubmission(input);
        return { ...result, source: "ai" };
      } catch (err) {
        console.error("Live assessment failed, falling back to demo scoring:", err);
      }
    }
    const result = await demo.assessSubmission(input);
    return { ...result, source: "demo" };
  }

  async generateCharacterFollowUp(input: CharacterFollowUpInput): Promise<string> {
    const provider = liveProvider();
    if (provider) {
      try {
        return await provider.generateCharacterFollowUp(input);
      } catch (err) {
        console.error("Live character reply failed, falling back to demo reply:", err);
      }
    }
    return demo.generateCharacterFollowUp(input);
  }
}

export const aiProvider = new ResilientAiProvider();
