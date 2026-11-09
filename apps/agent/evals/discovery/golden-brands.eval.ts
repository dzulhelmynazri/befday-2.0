import { defineEval } from "eve/evals";

interface GoldenBrandFixture {
  readonly brand: string;
  readonly expectedBadge: "FREE" | "VOUCHER";
  readonly query: string;
}

const GOLDEN_BRANDS: readonly GoldenBrandFixture[] = [
  {
    brand: "Starbucks Malaysia",
    expectedBadge: "VOUCHER",
    query:
      "Process birthday perk for Starbucks Malaysia: Free slice of cake with any handcrafted beverage purchase in birthday month via Starbucks Rewards app.",
  },
  {
    brand: "A&W Malaysia",
    expectedBadge: "FREE",
    query:
      "Process birthday perk for A&W Malaysia: Free 1 mug of regular Root Beer on actual birthday with NRIC verification, no purchase required.",
  },
  {
    brand: "FamilyMart Malaysia",
    expectedBadge: "FREE",
    query:
      "Process birthday perk for FamilyMart Malaysia: Free birthday Sofuto ice cream via the MY FamilyMart mobile app during birthday month with no minimum spend.",
  },
  {
    brand: "IKEA Family Malaysia",
    expectedBadge: "VOUCHER",
    query:
      "Process birthday perk for IKEA Family Malaysia: Free slice of Daim cake with any main course purchase at IKEA Restaurant during birthday month.",
  },
  {
    brand: "Boost Juice Malaysia",
    expectedBadge: "FREE",
    query:
      "Process birthday perk for Boost Juice Malaysia: Free standard original size drink for VIBE club members during birthday month with zero purchase requirement.",
  },
];

export default GOLDEN_BRANDS.map((fixture) =>
  defineEval({
    description: `Golden Benchmark: ${fixture.brand} badge classification (${fixture.expectedBadge})`,
    tags: ["benchmark", "discovery"],
    async test(t) {
      await t.send(fixture.query);
      t.succeeded();
      t.calledTool("upsert_brand_perk", {
        input: {
          badge: fixture.expectedBadge,
        },
      });
    },
  })
);
