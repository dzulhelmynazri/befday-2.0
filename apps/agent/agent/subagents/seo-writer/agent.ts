import { defineAgent } from "eve";
import { auto } from "eve/models";

export default defineAgent({
  description:
    "Researches and drafts high-ranking SEO blog posts, guides, and listicles for birthday perks and merchant rewards.",
  model: auto({
    fallback: "anthropic/claude-3-5-sonnet-20241022",
    options: {
      "anthropic/claude-3-5-sonnet-20241022":
        "Full long-form listicles, deep merchant guides, and complex structured schema generation",
      "openai/gpt-4o-mini":
        "Meta descriptions, short PAA FAQ answers, outline drafting, and slug generation",
    },
  }),
});
