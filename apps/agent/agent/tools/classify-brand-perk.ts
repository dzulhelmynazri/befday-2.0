import { decide } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

const classifyBrandPerkSchema = z.object({
  brandName: z.string().min(1).describe("Brand or merchant name"),
  headline: z.string().min(1).describe("Promo title or description hook"),
  howToRedeem: z
    .array(z.string())
    .default([])
    .describe("Redemption requirements and steps"),
  perksList: z
    .array(z.string())
    .min(1)
    .describe("List of benefits or freebies"),
  termsConditions: z
    .string()
    .optional()
    .describe("Terms, conditions, and fine print"),
});

export default defineTool({
  description:
    "Classifies whether a birthday perk is FREE or a VOUCHER, checks if purchase is required, and determines the redemption window.",
  execute: async (input, ctx) => {
    const decision = await decide({
      questions: {
        badge: {
          criteria: {
            FREE: "100% free reward, drink, dessert, or item with zero purchase or spending requirement.",
            VOUCHER:
              "Requires a purchase, minimum spend, paid main course, or discount coupon redemption.",
          },
          instructions:
            "Classify whether this birthday perk is strictly FREE (no purchase needed) or a VOUCHER (requires purchase, spend, or coupon redemption).",
          type: "choice",
        },
        requiresPurchase: {
          instructions:
            "Does the customer need to make a purchase, spend a minimum amount, or buy another item to redeem this perk?",
          type: "boolean",
        },
        validityWindow: {
          criteria: {
            ACTUAL_DAY:
              "Valid only on the exact calendar date of the birthday.",
            BIRTHDAY_MONTH: "Valid throughout the entire birthday month.",
            BIRTHDAY_WEEK: "Valid within the birthday week.",
            NOT_SPECIFIED: "Validity window is unspecified or unknown.",
          },
          instructions:
            "Determine the validity redemption window for this birthday perk.",
          type: "choice",
        },
      },
      signal: ctx.abortSignal,
      state: {
        brandName: input.brandName,
        headline: input.headline,
        howToRedeem: input.howToRedeem,
        perksList: input.perksList,
        termsConditions: input.termsConditions ?? null,
      },
    });

    return {
      badge: decision.answers.badge.choice,
      purchaseRequiredProbability:
        decision.answers.requiresPurchase.probability,
      requiresPurchase: decision.answers.requiresPurchase.probability > 0.5,
      validityWindow: decision.answers.validityWindow.choice,
    };
  },
  inputSchema: classifyBrandPerkSchema,
});
