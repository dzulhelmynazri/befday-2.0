import { defineAgent } from "eve";
import { auto } from "eve/models";

export default defineAgent({
  description:
    "Finds, verifies, and catalogs birthday perks and brand rewards into the database.",
  model: auto({
    fallback: "anthropic/claude-3-5-sonnet-20241022",
    options: {
      "anthropic/claude-3-5-sonnet-20241022":
        "Complex brand research, deep verification, writing articles, and tool executions",
      "openai/gpt-4o-mini":
        "Simple greetings, quick questions, single perk lookups, and short conversational replies",
    },
  }),
});
