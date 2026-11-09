import { defineEval } from "eve/evals";
import { equals } from "eve/evals/expect";

export default defineEval({
  description:
    "Target health: Verifies local agent server responds on health route",
  tags: ["fast", "smoke"],
  async test(t) {
    const res = await t.target.fetch("/eve/v1/health");

    t.succeeded();
    t.check(res.status, equals(200));
  },
});
