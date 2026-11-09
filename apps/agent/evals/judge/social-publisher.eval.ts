import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "Judge social media post density, cheat-sheet format, and viral saveability using JEV",
  tags: ["judge", "social"],
  async test(t) {
    const turn = await t.send(
      "Draft a viral Instagram and Threads post featuring 5 must-claim Malaysian birthday perks for this weekend."
    );

    t.succeeded();

    const judgments = t.judge({
      questions: {
        cheatSheetDensity: {
          instructions:
            "Does the post follow a high-density 'Brand - Short Reward' cheat-sheet format (e.g. 'Zus Coffee - Free slice of cake') rather than lengthy corporate paragraphs?",
          type: "boolean",
        },
        conciseSlideCopy: {
          instructions:
            "Does the post keep slide and caption copy punchy and screenshot-friendly, directing readers to befday.com for full claim steps rather than cramming full terms onto slides?",
          type: "boolean",
        },
        saveableHook: {
          instructions:
            "Is the opening hook engaging and designed to drive saves/bookmarks (e.g. bookmark this before your birthday month)?",
          type: "boolean",
        },
      },
      state: {
        socialCopy: turn.reply ?? "",
      },
    });

    judgments.cheatSheetDensity.atLeast(0.85);
    judgments.conciseSlideCopy.atLeast(0.8);
    judgments.saveableHook.atLeast(0.8);
  },
});
