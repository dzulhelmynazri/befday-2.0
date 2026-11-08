import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Drafts, optimizes, and schedules multi-platform social media posts (Instagram, Threads, TikTok, Facebook, LinkedIn, Pinterest, Google Business) for featured birthday perks via NeuLink.",
  model: "anthropic/claude-3-5-sonnet-20241022",
  reasoning: "medium",
});
