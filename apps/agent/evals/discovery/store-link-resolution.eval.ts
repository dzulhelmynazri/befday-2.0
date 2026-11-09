import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "Discovery toolchain: Resolves official store links and Google Maps before database upsert",
  tags: ["fast", "discovery"],
  async test(t) {
    await t.send(
      "Discover and catalog the official mobile app store links and Google Maps locator for 'A&W'."
    );

    t.succeeded();
    t.calledTool("lookup_app_stores", {
      input: { brandName: "A&W" },
    });
    t.calledTool("lookup_google_maps", {
      input: { brandName: "A&W" },
    });
  },
});
