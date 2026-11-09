import { defineEval } from "eve/evals";

export default [
  defineEval({
    description:
      "Subagent execution: seo-writer subagent invokes upsert_blog_post to record articles",
    tags: ["subagents", "fast"],
    async test(t) {
      await t.send(
        "Generate and save an SEO guide to the database titled 'Best Birthday Treats in Bangsar 2026'."
      );

      t.succeeded();
      t.calledTool("upsert_blog_post");
    },
  }),
  defineEval({
    description:
      "Subagent execution: social-publisher invokes generate_carousel_slides with minimalist brand rewards",
    tags: ["subagents", "fast"],
    async test(t) {
      await t.send(
        "Generate social carousel slides for the weekend featuring Zus Coffee and FamilyMart birthday perks."
      );

      t.succeeded();
      t.calledTool("generate_carousel_slides");
    },
  }),
];
