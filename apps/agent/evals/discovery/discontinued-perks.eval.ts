import { defineEval } from "eve/evals";

export default [
  defineEval({
    description:
      "Perk lifecycle: Set status to EXPIRED when a merchant discontinues their birthday perk",
    tags: ["fast", "discovery"],
    async test(t) {
      await t.send(
        "Update birthday perk record for 'Old Town White Coffee': The merchant officially announced that their free birthday drink promo is permanently discontinued as of this year."
      );

      t.succeeded();
      t.calledTool("upsert_brand_perk", {
        input: {
          status: "EXPIRED",
        },
      });
    },
  }),
  defineEval({
    description:
      "Perk lifecycle: Set validity to 'Not specified' when reward duration is unknown or unstated",
    tags: ["fast", "discovery"],
    async test(t) {
      await t.send(
        "Catalog birthday perk for 'Nyonya Colors': Complimentary dessert provided on presentation of birthday voucher, but validity duration is not stated in merchant terms."
      );

      t.succeeded();
      t.calledTool("upsert_brand_perk", {
        input: {
          validity: "Not specified",
        },
      });
    },
  }),
];
