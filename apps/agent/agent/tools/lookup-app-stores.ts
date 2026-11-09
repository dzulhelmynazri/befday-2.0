import { decide } from "eve/ai";
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

export interface LookupAppStoresResult {
  readonly appStoreUrl: string | undefined;
  readonly brandName: string;
  readonly logoUrl: string | undefined;
  readonly playStoreUrl: string;
}

export default defineTool({
  description:
    "Looks up official mobile app store links (Apple App Store and Google Play Store) and logo artwork for a brand.",
  execute: async ({ brandName }, ctx): Promise<LookupAppStoresResult> => {
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

        if (app?.trackViewUrl && app.trackName) {
          try {
            const decision = await decide({
              questions: {
                isOfficialApp: {
                  instructions:
                    "Does this app name represent the official customer loyalty, rewards, or service app for this brand, rather than an unrelated indie game or third-party guide?",
                  type: "boolean",
                },
              },
              signal: ctx.abortSignal,
              state: {
                appTitle: app.trackName,
                brandName,
              },
            });

            if (decision.answers.isOfficialApp.probability >= 0.6) {
              appStoreUrl = app.trackViewUrl;
              logoUrl = app.artworkUrl512 ?? app.artworkUrl100;
            }
          } catch {
            appStoreUrl = app.trackViewUrl;
            logoUrl = app.artworkUrl512 ?? app.artworkUrl100;
          }
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
      .min(1)
      .describe("Brand or app name (e.g. 'A&W', 'Starbucks')"),
  }),
});
