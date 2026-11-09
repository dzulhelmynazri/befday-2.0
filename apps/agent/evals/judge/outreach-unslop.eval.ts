import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "Judge B2B outreach draft using JEV for conciseness, un-slopped tone, and actionable CTA",
  tags: ["judge", "outreach"],
  async test(t) {
    const turn = await t.send(
      "Draft a first-touch outreach email to the marketing manager of an artisanal bakery in Bangsar inviting them to verify their listing on befday.com."
    );

    t.succeeded();

    const judgments = t.judge({
      questions: {
        actionableCallToAction: {
          instructions:
            "Does the email present a clear, low-friction next step (such as verifying or claiming a profile link)?",
          type: "boolean",
        },
        conciseness: {
          instructions:
            "Is the message concise (under 120 words) and quickly gets to the point?",
          type: "boolean",
        },
        unslopTone: {
          instructions:
            "Is the email written in a natural, human tone without robotic AI clichés (e.g. 'in today's fast-paced world', 'delve', 'thrilled to connect', 'seamlessly')?",
          type: "boolean",
        },
      },
      state: {
        draft: turn.reply ?? "",
      },
    });

    judgments.unslopTone.atLeast(0.85);
    judgments.conciseness.atLeast(0.8);
    judgments.actionableCallToAction.atLeast(0.8);
  },
});
