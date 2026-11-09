import { decide } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

const classifyContactRoleSchema = z.object({
  brandName: z.string().min(1).describe("Brand or merchant name"),
  contactEmail: z.email().optional().describe("Scraped email address"),
  contactTitle: z
    .string()
    .optional()
    .describe("Job title or page context where found"),
  sourceUrl: z.string().optional().describe("URL where the contact was found"),
});

export interface ClassifyContactRoleResult {
  readonly category: "PARTNERSHIP_FIT" | "STORE_LEVEL" | "IRRELEVANT";
  readonly isDecisionMaker: boolean;
  readonly reason: string;
}

export default defineTool({
  description:
    "Evaluates whether a scraped contact is an appropriate marketing, brand, or partnership decision-maker for B2B outreach.",
  execute: async (input, ctx): Promise<ClassifyContactRoleResult> => {
    const decision = await decide({
      questions: {
        category: {
          criteria: {
            IRRELEVANT:
              "Job application, careers, investor relations, customer complaints, privacy, or legal inbox (e.g. jobs@, hr@, legal@).",
            PARTNERSHIP_FIT:
              "Marketing lead, brand manager, partnership coordinator, founder, or general business collaboration contact.",
            STORE_LEVEL:
              "Branch-specific store, cashier, or local outlet inbox (e.g. store12@, sunway@).",
          },
          instructions:
            "Categorize the role and relevance of this business contact for brand partnership outreach.",
          type: "choice",
        },
        isDecisionMaker: {
          instructions:
            "Does this person or inbox likely hold authority over brand marketing, collaborations, or partner listings?",
          type: "boolean",
        },
      },
      signal: ctx.abortSignal,
      state: {
        brandName: input.brandName,
        contactEmail: input.contactEmail ?? null,
        contactTitle: input.contactTitle ?? null,
        sourceUrl: input.sourceUrl ?? null,
      },
    });

    const category = decision.answers.category.choice;

    const isDecisionMaker =
      decision.answers.isDecisionMaker.probability > 0.5 &&
      category === "PARTNERSHIP_FIT";

    return {
      category,
      isDecisionMaker,
      reason:
        category === "PARTNERSHIP_FIT"
          ? "Contact appears relevant for marketing or partnership discussions."
          : `Contact categorized as ${category.toLowerCase().replace("_", " ")} and should be skipped for outreach.`,
    };
  },
  inputSchema: classifyContactRoleSchema,
});
