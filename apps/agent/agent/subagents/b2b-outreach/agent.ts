import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Researches Malaysian brand decision-makers via Treg, sends verified peer-to-peer partner emails through Cloudflare Email, and queues 1-tap WhatsApp drafts to Telegram.",
  model: "anthropic/claude-3-5-sonnet-20241022",
  reasoning: "medium",
});
