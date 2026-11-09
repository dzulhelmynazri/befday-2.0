import { perkBadgeSchema, perkStatusSchema } from "@befday-2.0/contracts";
import type { SocialTheme } from "@befday-2.0/contracts";
import type { Prisma } from "@befday-2.0/db";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { db } from "./db";

const DEFAULT_LIMIT = 20 as const;
const MAX_LIMIT = 100 as const;

const NEXT_THEME_MAP = {
  charcoal: "paper",
  paper: "terracotta",
  terracotta: "charcoal",
} as const satisfies Record<SocialTheme, SocialTheme>;

const isSocialTheme = (theme: string): theme is SocialTheme =>
  theme in NEXT_THEME_MAP;

const getNextTheme = (lastTheme: string | null): SocialTheme => {
  if (lastTheme && isSocialTheme(lastTheme)) {
    return NEXT_THEME_MAP[lastTheme];
  }

  return "paper";
};

const SORT_BY_OPTIONS = [
  "newest",
  "unposted_first",
  "oldest_verified",
] as const;

type SortBy = (typeof SORT_BY_OPTIONS)[number];

const ORDER_BY = {
  newest: [{ createdAt: "desc" }],
  oldest_verified: [{ verifiedAt: "asc" }],
  unposted_first: [
    { lastPostedAt: { nulls: "first", sort: "asc" } },
    { createdAt: "desc" },
  ],
} satisfies Record<SortBy, Prisma.BirthdayPerkOrderByWithRelationInput[]>;

const inputSchema = z.object({
  badge: perkBadgeSchema
    .optional()
    .describe("Filter by badge type: FREE or VOUCHER"),
  limit: z
    .number()
    .int()
    .positive()
    .max(MAX_LIMIT)
    .default(DEFAULT_LIMIT)
    .describe("Maximum number of perks to retrieve (up to 100)"),
  search: z
    .string()
    .optional()
    .describe("Keyword search matching brand name or headline"),
  sortBy: z
    .enum(SORT_BY_OPTIONS)
    .default("newest")
    .describe(
      "Sort order: 'newest' (default createdAt desc), 'unposted_first' (never/least-recently featured on social media first), or 'oldest_verified' (stalest verifiedAt first for weekly verification)"
    ),
  status: perkStatusSchema
    .default("PUBLISHED")
    .describe("Status of perks to retrieve"),
});

export interface BrandPerkSummary {
  readonly appStoreUrl: string | null;
  readonly badge: string;
  readonly brandName: string;
  readonly brandSlug: string;
  readonly googleMapUrl: string | null;
  readonly headline: string;
  readonly howToRedeem: readonly string[];
  readonly lastPostedAt: Date | null;
  readonly lastTheme: string | null;
  readonly logoUrl: string | null;
  readonly perksList: readonly string[];
  readonly playStoreUrl: string | null;
  readonly termsConditions: string | null;
  readonly validity: string;
  readonly verifiedAt: Date | null;
  readonly websiteUrl: string | null;
}

export interface GetBrandPerksResult {
  readonly count: number;
  readonly lastTheme: string | null;
  readonly nextTheme: SocialTheme;
  readonly perks: readonly BrandPerkSummary[];
}

export const createGetBrandPerksTool = (description: string) =>
  defineTool({
    description,
    execute: async ({
      badge,
      limit,
      search,
      sortBy,
      status,
    }): Promise<GetBrandPerksResult> => {
      const where: Prisma.BirthdayPerkWhereInput = {
        status,
      };

      if (badge) {
        where.badge = badge;
      }

      const trimmedSearch = search?.trim();

      if (trimmedSearch) {
        where.OR = [
          { brand: { name: { contains: trimmedSearch, mode: "insensitive" } } },
          { headline: { contains: trimmedSearch, mode: "insensitive" } },
        ];
      }

      const [perks, latestPost] = await Promise.all([
        db.birthdayPerk.findMany({
          include: {
            brand: true,
          },
          orderBy: ORDER_BY[sortBy],
          take: limit,
          where,
        }),
        db.birthdayPerk.findFirst({
          orderBy: { lastPostedAt: "desc" },
          select: { lastTheme: true },
          where: {
            lastPostedAt: { not: null },
            lastTheme: { not: null },
          },
        }),
      ]);

      const lastTheme = latestPost?.lastTheme ?? null;

      return {
        count: perks.length,
        lastTheme,
        nextTheme: getNextTheme(lastTheme),
        perks: perks.map((perk) => ({
          appStoreUrl: perk.brand.appStoreUrl,
          badge: perk.badge,
          brandName: perk.brand.name,
          brandSlug: perk.brand.slug,
          googleMapUrl: perk.brand.googleMapUrl,
          headline: perk.headline,
          howToRedeem: perk.howToRedeem,
          lastPostedAt: perk.lastPostedAt,
          lastTheme: perk.lastTheme,
          logoUrl: perk.brand.logoUrl,
          perksList: perk.perksList,
          playStoreUrl: perk.brand.playStoreUrl,
          termsConditions: perk.termsConditions,
          validity: perk.validity,
          verifiedAt: perk.verifiedAt,
          websiteUrl: perk.brand.websiteUrl,
        })),
      };
    },
    inputSchema,
  });
