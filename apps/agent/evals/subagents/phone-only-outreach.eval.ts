import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "Partner outreach: Supports phone-only merchants with WhatsApp draft when email is unavailable",
  tags: ["subagents", "fast"],
  async test(t) {
    await t.send(
      "Run outreach for 'Bukit Bintang Bakery' (slug: 'bukit-bintang-bakery'). The merchant has no email, but has WhatsApp business phone 60123456789. Invite them to claim their listing."
    );

    t.succeeded();
    t.calledTool("send_partner_outreach", {
      input: {
        angle: "CLAIM_LISTING",
        brandSlug: "bukit-bintang-bakery",
        contactPhone: "60123456789",
      },
    });
  },
});
