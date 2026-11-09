import { defineEval } from "eve/evals";

export default defineEval({
  description: "Agent greeting and smoke test without invoking external tools",
  tags: ["fast", "smoke"],
  async test(t) {
    await t.send("Hello! What are you able to help me with?");
    t.succeeded();
    t.usedNoTools();
    t.judge(
      "The response explains the agent's role in discovering birthday perks and assisting with deals."
    ).atLeast(0.8);
  },
});
