import type { OutreachStatus } from "@befday-2.0/db";
import { decide } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { db } from "@/lib/db";

const classifyOutreachReplySchema = z.object({
  brandSlug: z
    .string()
    .min(1)
    .describe("Slug of the contacted brand (e.g. 'zus-coffee')"),
  channel: z
    .enum(["email", "whatsapp"])
    .default("email")
    .describe("Channel through which the reply was received"),
  replyText: z
    .string()
    .min(1)
    .describe("Exact body text of the reply received from the brand contact"),
});

export type OutreachReplyIntent =
  | "ALREADY_VERIFIED"
  | "INTERESTED"
  | "OUT_OF_OFFICE"
  | "UNSUBSCRIBE_REQUEST";

export interface ClassifyOutreachReplyResult {
  readonly actionTaken: string;
  readonly confidence: number;
  readonly intent: OutreachReplyIntent;
  readonly nextRecommendedStep: string;
  readonly updatedStatus: OutreachStatus | null;
}

export default defineTool({
  description:
    "Classifies an inbound brand reply into INTERESTED, ALREADY_VERIFIED, OUT_OF_OFFICE, or UNSUBSCRIBE_REQUEST, and automatically updates the outreach status in the database.",
  execute: async (input, ctx): Promise<ClassifyOutreachReplyResult> => {
    const decision = await decide({
      questions: {
        intent: {
          criteria: {
            ALREADY_VERIFIED:
              "Merchant confirms their birthday perk details are accurate or already verified as shown.",
            INTERESTED:
              "Merchant or marketer expresses interest in listing, verifying, claiming their profile, or asking how it works.",
            OUT_OF_OFFICE:
              "Automated vacation responder, out-of-office autoreply, or temporary absence notification.",
            UNSUBSCRIBE_REQUEST:
              "Merchant asks to stop contacting them, unsubscribes, declines listing, or requests removal.",
          },
          instructions:
            "Classify the merchant's reply intent into one of the four categories.",
          type: "choice",
        },
      },
      signal: ctx.abortSignal,
      state: {
        brandSlug: input.brandSlug,
        channel: input.channel,
        replyText: input.replyText,
      },
    });

    const { intent: intentAnswer } = decision.answers;
    const intent = intentAnswer.choice;
    const confidence = intentAnswer.probabilities?.[intent] ?? 1;

    let updatedStatus: OutreachStatus | null = null;
    let actionTaken = "";
    let nextRecommendedStep = "";

    const existingOutreach = await db.partnerOutreach.findUnique({
      where: { brandSlug: input.brandSlug },
    });

    if (intent === "UNSUBSCRIBE_REQUEST") {
      updatedStatus = "OPTED_OUT";
      actionTaken = "Updated brand status to OPTED_OUT.";
      nextRecommendedStep =
        "Do not send further emails or WhatsApp messages to this brand.";
    } else if (intent === "ALREADY_VERIFIED") {
      updatedStatus = "CONVERTED";
      actionTaken = "Updated brand status to CONVERTED.";
      nextRecommendedStep =
        "Send thank-you confirmation confirming their verified badge is active on befday.com.";
    } else if (intent === "INTERESTED") {
      updatedStatus = "REPLIED";
      actionTaken = "Updated brand status to REPLIED.";
      nextRecommendedStep =
        "Send partner claiming steps and onboarding instructions.";
    } else {
      updatedStatus = null;
      actionTaken =
        "No status update; detected automated out-of-office responder.";
      nextRecommendedStep =
        "Pause outreach and follow up after the contact's return date.";
    }

    if (existingOutreach && updatedStatus) {
      await db.partnerOutreach.update({
        data: { status: updatedStatus },
        where: { brandSlug: input.brandSlug },
      });
    }

    return {
      actionTaken,
      confidence,
      intent,
      nextRecommendedStep,
      updatedStatus,
    };
  },
  inputSchema: classifyOutreachReplySchema,
});
