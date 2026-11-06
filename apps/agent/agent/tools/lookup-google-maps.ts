import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Resolves the Google Maps location link or store locator for a brand.",
  execute({ brandName }) {
    const query = brandName.trim();

    const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;

    return Promise.resolve({
      brandName: query,
      googleMapUrl,
    });
  },
  inputSchema: z.object({
    brandName: z.string().describe("Brand or merchant name (e.g. 'A&W')"),
  }),
});
