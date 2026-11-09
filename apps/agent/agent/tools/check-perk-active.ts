import { decide } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

const checkPerkActiveSchema = z.object({
  brandName: z.string().min(1).describe("Brand or merchant name"),
  perkDetails: z
    .string()
    .min(1)
    .describe("Original perk summary or expected promotion"),
  scrapedContent: z
    .string()
    .min(1)
    .describe("Scraped text from merchant website or loyalty FAQ"),
});

export default defineTool({
  description:
    "Evaluates whether a merchant's birthday perk is still active or expired based on fresh web content.",
  execute: async (input, ctx) => {
    const decision = await decide({
      questions: {
        isActive: {
          instructions:
            "Does the text confirm that this merchant currently offers this birthday perk or reward?",
          type: "boolean",
        },
        status: {
          criteria: {
            EXPIRED:
              "The merchant explicitly discontinued the birthday reward or no longer offers it.",
            NEEDS_REVIEW:
              "The text does not mention the birthday perk or the evidence is inconclusive.",
            PUBLISHED:
              "The text confirms that the birthday perk is active and valid.",
          },
          instructions:
            "Determine the verification status for this birthday perk record.",
          type: "choice",
        },
      },
      signal: ctx.abortSignal,
      state: {
        brandName: input.brandName,
        perkDetails: input.perkDetails,
        scrapedContent: input.scrapedContent,
      },
    });

    return {
      activeProbability: decision.answers.isActive.probability,
      isActive: decision.answers.isActive.probability > 0.5,
      recommendedStatus: decision.answers.status.choice,
    };
  },
  inputSchema: checkPerkActiveSchema,
});
