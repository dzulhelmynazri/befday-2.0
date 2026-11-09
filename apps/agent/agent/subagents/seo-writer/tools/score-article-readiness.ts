import { decide } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

const scoreArticleReadinessSchema = z.object({
  articleContent: z
    .string()
    .min(50)
    .describe("Full markdown content of the draft blog post"),
  primaryKeyword: z
    .string()
    .min(2)
    .describe(
      "Primary target keyword or search phrase (e.g. 'Birthday Freebies Malaysia')"
    ),
  title: z.string().min(5).describe("Article title"),
});

export interface ScoreArticleReadinessResult {
  readonly feedback: string;
  readonly hasAnswerCapsule: boolean;
  readonly hasFaqSection: boolean;
  readonly hasStructuredComparison: boolean;
  readonly isAiFluff: boolean;
  readonly needsRevision: boolean;
  readonly readinessScore: number;
}

export default defineTool({
  description:
    "Evaluates an SEO article for Answer Capsule clarity, PAA FAQ presence, structured comparison tables, and absence of generic AI filler before publication.",
  execute: async (input, ctx): Promise<ScoreArticleReadinessResult> => {
    const decision = await decide({
      questions: {
        answerCapsule: {
          instructions:
            "Does the article begin with a self-contained 40-60 word Answer Capsule directly answering the search intent without introductory fluff (e.g., 'In this article we will explore', 'In today's fast-paced world')?",
          type: "boolean",
        },
        faqSection: {
          instructions:
            "Does the article include a dedicated Frequently Asked Questions (FAQ) or People Also Ask section addressing common consumer questions?",
          type: "boolean",
        },
        isAiFluff: {
          instructions:
            "Does the article opening contain robotic AI clichés, rhetorical questions, or repetitive filler instead of immediate factual answers?",
          type: "boolean",
        },
        readinessScore: {
          criteria: [
            "Lacks Answer Capsule, full of AI filler, missing structured tables and FAQs.",
            "Answers the query but contains introductory fluff or lacks structured comparison elements.",
            "Good: Clear Answer Capsule and structured content, but could improve FAQ depth or table clarity.",
            "Excellent: Exemplary AI-SEO readiness with a direct 40-60 word Answer Capsule, clean comparison tables/cards, and comprehensive FAQs.",
          ],
          instructions:
            "Score the article's readiness for AI search engine citation and high Google CTR on a 1 to 4 rubric.",
          type: "score",
        },
        structuredComparison: {
          instructions:
            "Does the article include structured comparison elements, such as Markdown comparison tables, ::perk directives, or clean bulleted perk breakdowns?",
          type: "boolean",
        },
      },
      signal: ctx.abortSignal,
      state: {
        articleIntro: input.articleContent.slice(0, 3000),
        primaryKeyword: input.primaryKeyword,
        title: input.title,
      },
    });

    const {
      answerCapsule,
      faqSection,
      isAiFluff: fluffAnswer,
      readinessScore: scoreAnswer,
      structuredComparison,
    } = decision.answers;

    const { score } = scoreAnswer;
    const hasAnswerCapsule = answerCapsule.probability > 0.5;
    const hasFaqSection = faqSection.probability > 0.5;
    const hasStructuredComparison = structuredComparison.probability > 0.5;
    const isAiFluff = fluffAnswer.probability > 0.5;

    const needsRevision = score < 3 || isAiFluff || !hasAnswerCapsule;

    const feedback = needsRevision
      ? "Article needs revision: Ensure the first 40-60 words provide an immediate Answer Capsule without filler, remove AI clichés, and verify PAA FAQs and comparison tables/perk cards are included."
      : "Article is high quality, well-structured, and ready for publication.";

    return {
      feedback,
      hasAnswerCapsule,
      hasFaqSection,
      hasStructuredComparison,
      isAiFluff,
      needsRevision,
      readinessScore: score,
    };
  },
  inputSchema: scoreArticleReadinessSchema,
});
