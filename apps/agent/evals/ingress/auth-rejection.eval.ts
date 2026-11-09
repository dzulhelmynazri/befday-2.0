import { defineEval } from "eve/evals";
import { satisfies } from "eve/evals/expect";

export default defineEval({
  description:
    "Target security: Protected agent session routes reject unauthenticated requests",
  tags: ["fast", "smoke"],
  async test(t) {
    const res = await t.target.fetch("/eve/v1/sessions", {
      body: JSON.stringify({ message: "Ping unauthenticated" }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    t.succeeded();
    t.check(
      res.status,
      satisfies(
        (status) => status === 401 || status === 403 || status === 404,
        "protected route rejects unauthenticated callers"
      )
    );
  },
});
