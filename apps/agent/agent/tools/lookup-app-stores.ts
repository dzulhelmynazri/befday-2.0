import { defineTool } from "eve/tools";
import { z } from "zod";

const itunesResponseSchema = z.object({
  resultCount: z.number().optional(),
  results: z
    .array(
      z.object({
        artworkUrl100: z.string().optional(),
        artworkUrl512: z.string().optional(),
        trackName: z.string().optional(),
        trackViewUrl: z.string().optional(),
      })
    )
    .optional(),
});

export default defineTool({
  description:
    "Looks up official mobile app store links (Apple App Store and Google Play Store) and logo artwork for a brand.",
  async execute({ brandName }) {
    let appStoreUrl: string | null = null;
    let logoUrl: string | null = null;

    // 1. Search Apple App Store via iTunes Search API
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
      brandName
    )}&entity=software&limit=1`;

    const response = await fetch(itunesUrl, {
      headers: { "User-Agent": "befday-agent/1.0" },
    });

    if (response.ok) {
      const rawJson: unknown = await response.json();
      const parsed = itunesResponseSchema.safeParse(rawJson);

      if (parsed.success) {
        const app = parsed.data.results?.[0];

        if (app) {
          appStoreUrl = app.trackViewUrl ?? null;
          logoUrl = app.artworkUrl512 ?? app.artworkUrl100 ?? null;
        }
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
