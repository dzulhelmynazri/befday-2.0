import { defineTool } from "eve/tools";
import { z } from "zod";

const itunesResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(
    z.object({
      artworkUrl100: z.string().optional(),
      artworkUrl512: z.string().optional(),
      trackName: z.string().optional(),
      trackViewUrl: z.string().optional(),
    })
  ),
});

export default defineTool({
  description:
    "Looks up official mobile app store links (Apple App Store and Google Play Store) and logo artwork for a brand.",
  async execute({ brandName }) {
    // 1. Search Apple App Store via iTunes Search API
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
      brandName
    )}&entity=software&limit=1`;

    let appStoreUrl: string | undefined;
    let logoUrl: string | undefined;

    const response = await fetch(itunesUrl, {
      headers: { "User-Agent": "befday-agent/1.0" },
    });

    if (response.ok) {
      const rawJson: unknown = await response.json();
      const parsed = itunesResponseSchema.safeParse(rawJson);

      if (parsed.success) {
        const [app] = parsed.data.results;
        appStoreUrl = app?.trackViewUrl;
        logoUrl = app?.artworkUrl512 ?? app?.artworkUrl100;
      }
    }

    // 2. Play Store Search standard search query format
    const playStoreUrl = `https://play.google.com/store/search?q=${encodeURIComponent(
      brandName
    )}&c=apps`;

    return {
      appStoreUrl,
      brandName,
      logoUrl,
      playStoreUrl,
    };
  },
  inputSchema: z.object({
    brandName: z
      .string()
      .describe("Brand or app name (e.g. 'A&W', 'Starbucks')"),
  }),
});
