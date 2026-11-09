import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "Judge SEO blog article structure, Answer Capsule, and AI-search citation readiness using JEV",
  tags: ["judge", "seo"],
  async test(t) {
    const turn = await t.send(
      "Draft an SEO guide for 'Top Birthday Freebies in Kuala Lumpur' for the blog."
    );

    t.succeeded();

    const judgments = t.judge({
      questions: {
        answerCapsule: {
          instructions:
            "Does the article begin with a standalone 40-60 word Answer Capsule that directly answers where to get birthday freebies without introductory fluff (e.g. 'In this blog post we will dive into...')?",
          type: "boolean",
        },
        faqSection: {
          instructions:
            "Does the article include a dedicated People Also Ask (PAA) FAQ section addressing common questions (e.g. claim timing, IC verification)?",
          type: "boolean",
        },
        structuredComparison: {
          instructions:
            "Does the article incorporate structured Markdown tables or clean bulleted perk comparisons to make it easily scannable and citeable by AI search engines?",
          type: "boolean",
        },
      },
      state: {
        articleContent: turn.reply ?? "",
      },
    });

    judgments.answerCapsule.atLeast(0.85);
    judgments.structuredComparison.atLeast(0.8);
    judgments.faqSection.atLeast(0.8);
  },
});
