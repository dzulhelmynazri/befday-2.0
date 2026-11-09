import { decide } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

const searchResultItemSchema = z.object({
  snippet: z.string().min(1).describe("Search snippet or summary text"),
  title: z.string().min(1).describe("Page title"),
  url: z.string().min(1).describe("Page URL"),
});

const filterSearchLeadsSchema = z.object({
  brandName: z.string().min(1).describe("Target brand name"),
  results: z
    .array(searchResultItemSchema)
    .min(1)
    .max(15)
    .describe("Search results to evaluate"),
});

export interface FilteredSearchLead {
  readonly isBirthdayDeal: boolean;
  readonly probability: number;
  readonly title: string;
  readonly url: string;
}

export interface FilterSearchLeadsResult {
  readonly relevantCount: number;
  readonly relevantLeads: readonly FilteredSearchLead[];
  readonly totalEvaluated: number;
}

export default defineTool({
  description:
    "Pre-screens raw web search results to filter out irrelevant links before web scraping.",
  execute: async (input, ctx): Promise<FilterSearchLeadsResult> => {
    const evaluated = await Promise.all(
      input.results.map(async (item) => {
        const decision = await decide({
          questions: {
            isBirthdayDeal: {
              instructions:
                "Does this search result describe an actual customer birthday reward, discount, freebie, or loyalty promo for this brand, rather than an unrelated menu, party room rental, or general article?",
              type: "boolean",
            },
          },
          signal: ctx.abortSignal,
          state: {
            brandName: input.brandName,
            snippet: item.snippet,
            title: item.title,
          },
        });

        return {
          isBirthdayDeal: decision.answers.isBirthdayDeal.probability > 0.5,
          probability: decision.answers.isBirthdayDeal.probability,
          title: item.title,
          url: item.url,
        };
      })
    );

    const relevantLeads = evaluated.filter((lead) => lead.isBirthdayDeal);

    return {
      relevantCount: relevantLeads.length,
      relevantLeads,
      totalEvaluated: input.results.length,
    };
  },
  inputSchema: filterSearchLeadsSchema,
});
