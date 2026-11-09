import { defineEval } from "eve/evals";

export default [
  defineEval({
    description: "Route SEO and blog article requests to seo-writer subagent",
    tags: ["subagents", "fast"],
    async test(t) {
      await t.send(
        "Write a comprehensive SEO blog guide for the top 10 birthday freebies in Kuala Lumpur 2026."
      );
      t.succeeded();
      t.calledAgent("seo-writer");
    },
  }),
  defineEval({
    description:
      "Route multi-platform social announcements to social-publisher subagent",
    tags: ["subagents", "fast"],
    async test(t) {
      await t.send(
        "Prepare an Instagram carousel and Threads stack for this weekend's featured birthday perks."
      );
      t.succeeded();
      t.calledAgent("social-publisher");
    },
  }),
  defineEval({
    description: "Route merchant outreach tasks to b2b-outreach subagent",
    tags: ["subagents", "fast"],
    async test(t) {
      await t.send(
        "Reach out to FamilyMart Malaysia partnerships team to verify their birthday Sofuto promo."
      );
      t.succeeded();
      t.calledAgent("b2b-outreach");
    },
  }),
];
