import { defineEval } from "eve/evals";

export default defineEval({
  description: "Judge birthday perk extraction quality and clarity using JEV",
  tags: ["judge", "perks"],
  async test(t) {
    await t.send(
      "Extract and format the birthday perk for 'Zus Coffee': Users get a free slice of cake with any handcrafted drink purchase during their birthday month via the Zus App."
    );
    t.succeeded();

    t.judge({
      criteria: [
        "Unclear or missing redemption steps",
        "Basic steps provided but lacks channel or timing conditions",
        "Exemplary step-by-step instructions stating the app requirement and redemption window",
      ],
      instructions:
        "Evaluate the clarity and structure of the redemption steps in the response.",
      type: "score",
    })
      .label("redemptionClarity")
      .atLeast(0.7);

    t.judge(
      "The response explicitly classifies the perk badge as VOUCHER (not FREE) because it requires a drink purchase."
    )
      .label("badgeAccuracy")
      .gate(0.85);
  },
});
