import { defineEval } from "eve/evals";

export default [
  defineEval({
    description:
      "Assert 100% complimentary perk with no spend requirement receives FREE badge",
    tags: ["fast", "discovery"],
    async test(t) {
      await t.send(
        "Catalog birthday perk for 'A&W': Free 1 mug of RB (Root Beer) on actual birthday with identity card verification, no purchase required."
      );
      t.succeeded();
      t.calledTool("upsert_brand_perk", {
        input: {
          badge: "FREE",
          name: "A&W",
        },
      });
    },
  }),
  defineEval({
    description: "Assert spend-contingent perk receives VOUCHER badge",
    tags: ["fast", "discovery"],
    async test(t) {
      await t.send(
        "Catalog birthday perk for 'The Daily Grind': RM20 discount off total bill with a minimum spend of RM80 during birthday week."
      );
      t.succeeded();
      t.calledTool("upsert_brand_perk", {
        input: {
          badge: "VOUCHER",
        },
      });
    },
  }),
];
