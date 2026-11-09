import { defineEvalConfig } from "eve/evals";

export default defineEvalConfig({
  judge: {
    model: "typesafe-ai/jev",
  },
  maxConcurrency: 3,
  timeoutMs: 60_000,
});
