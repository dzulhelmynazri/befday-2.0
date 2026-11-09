import { defineAgent } from "eve";
import { auto } from "eve/models";

export default defineAgent({
  description:
    "Drafts, optimizes, and schedules multi-platform social media posts (Instagram, Threads, TikTok, Facebook, LinkedIn, Pinterest, Google Business) for featured birthday perks via NeuLink.",
  model: auto({
    fallback: "anthropic/claude-3-5-sonnet-20241022",
    options: {
      "anthropic/claude-3-5-sonnet-20241022":
        "Complex multi-platform campaign strategy, hook engineering, and slide generation",
      "openai/gpt-4o-mini":
        "Routine post captions, hashtag formatting, theme selection, and short status updates",
    },
  }),
});
