import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Researches and drafts high-ranking SEO blog posts, guides, and listicles for birthday perks and merchant rewards.",
  model: "anthropic/claude-3-5-sonnet-20241022",
  reasoning: "medium",
});
