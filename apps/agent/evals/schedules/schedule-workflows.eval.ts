import { defineEval } from "eve/evals";

export default [
  defineEval({
    description:
      "Schedule workflow: verify-perks queries oldest verified perks first",
    tags: ["schedules"],
    async test(t) {
      await t.send(
        "Run the weekly perk verification task: Check the stalest published perks in the database and verify that their rewards and redemption terms are still active."
      );
      t.succeeded();
      t.calledTool("get_brand_perks", {
        input: {
          sortBy: "oldest_verified",
          status: "PUBLISHED",
        },
      });
    },
  }),
  defineEval({
    description:
      "Schedule workflow: publish-weekly-perk queries unposted perks first and delegates to social-publisher",
    tags: ["schedules"],
    async test(t) {
      await t.send(
        "Run the scheduled weekly social post task: Feature verified perks that have never been posted or were posted least recently."
      );
      t.succeeded();
      t.calledAgent("social-publisher");
    },
  }),
  defineEval({
    description:
      "Schedule workflow: outreach-partners delegates to b2b-outreach subagent",
    tags: ["schedules"],
    async test(t) {
      await t.send(
        "Run the scheduled partner outreach workflow: Check candidate brands and due follow-ups."
      );
      t.succeeded();
      t.calledAgent("b2b-outreach");
    },
  }),
  defineEval({
    description:
      "Schedule workflow: discover-perks queries existing brands first to avoid redundant research",
    tags: ["schedules"],
    async test(t) {
      await t.send(
        "Run the scheduled perk discovery task: Discover newly launched or uncataloged birthday perks across brands in Malaysia."
      );
      t.succeeded();
      t.calledTool("get_brand_perks", {
        input: {
          limit: 100,
        },
      });
    },
  }),
];
