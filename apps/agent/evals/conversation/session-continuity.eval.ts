import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "Multi-turn conversation context and entity memory across consecutive turns",
  tags: ["multi-turn", "judge"],
  async test(t) {
    const first = await t.send(
      "Tell me about the birthday perks available at Zus Coffee."
    );

    t.succeeded();
    first.messageIncludes(/zus/iu);

    const second = await first.session.send(
      "How do I claim it and is there a purchase requirement?"
    );

    second.succeeded();
    t.judge(
      "The assistant remembers that the conversation is about Zus Coffee and explains that a handcrafted drink purchase is required via the Zus App.",
      { on: second.reply }
    ).atLeast(0.8);
  },
});
