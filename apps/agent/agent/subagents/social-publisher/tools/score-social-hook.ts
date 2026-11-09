import { socialChannelSchema } from "@befday-2.0/contracts";
import { decide } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

const scoreSocialHookSchema = z.object({
  brandNames: z
    .array(z.string().min(1))
    .min(1)
    .describe("Brands featured in this post"),
  channel: socialChannelSchema.describe("Target social media channel"),
  hookText: z
    .string()
    .min(5)
    .max(300)
    .describe("Opening hook, headline, or slide 1 cover text"),
});

export interface ScoreSocialHookResult {
  readonly feedback: string;
  readonly isCliche: boolean;
  readonly needsRevision: boolean;
  readonly score: number;
}

export default defineTool({
  description:
    "Evaluates an opening social media hook for clarity, curiosity, and absence of generic AI clichés before broadcasting.",
  execute: async (input, ctx): Promise<ScoreSocialHookResult> => {
    const decision = await decide({
      questions: {
        isCliche: {
          instructions:
            "Does this hook sound like an obvious AI opener (e.g. rhetorical questions, 'Attention X lovers', 'Look no further')?",
          type: "boolean",
        },
        qualityScore: {
          criteria: [
            "Boring AI cliché, zero curiosity, or corporate marketing fluff.",
            "Basic hook stating the perk but lacks curiosity or shareability.",
            "Good, punchy hook with clear value proposition and natural human tone.",
            "High-save hook with strong curiosity gap, direct perk promise, and zero fluff.",
          ],
          instructions:
            "Score the opening hook on a 1 to 4 rubric for social media virality, clarity, and natural human tone.",
          type: "score",
        },
      },
      signal: ctx.abortSignal,
      state: {
        brandNames: input.brandNames,
        channel: input.channel,
        hookText: input.hookText,
      },
    });

    const { isCliche: clicheAnswer, qualityScore } = decision.answers;
    const { score } = qualityScore;
    const isCliche = clicheAnswer.probability > 0.5;
    const needsRevision = score < 3 || isCliche;

    return {
      feedback: needsRevision
        ? "Hook sounds generic or lacks curiosity. Lead directly with the perk savings and remove rhetorical questions."
        : "Hook is punchy, clear, and ready for publication.",
      isCliche,
      needsRevision,
      score,
    };
  },
  inputSchema: scoreSocialHookSchema,
});
