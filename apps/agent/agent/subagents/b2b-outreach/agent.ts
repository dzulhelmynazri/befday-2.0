import { defineAgent } from "eve";
import { auto } from "eve/models";

export default defineAgent({
  description:
    "Researches Malaysian brand decision-makers via Treg, sends verified peer-to-peer partner emails through Cloudflare Email, and queues 1-tap WhatsApp drafts to Telegram.",
  model: auto({
    fallback: "anthropic/claude-3-5-sonnet-20241022",
    options: {
      "anthropic/claude-3-5-sonnet-20241022":
        "Deep merchant discovery, contact research on Treg, and complex partnership pitches",
      "openai/gpt-4o-mini":
        "Short follow-up emails, quick WhatsApp drafts, candidate status checks, and sequence logging",
    },
  }),
});
