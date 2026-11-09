import { perkBadgeSchema, perkStatusSchema } from "@befday-2.0/contracts";
import type { SocialTheme } from "@befday-2.0/contracts";
import type { Prisma } from "@befday-2.0/db";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { db } from "./db";

const getNextTheme = (lastTheme: string | null): SocialTheme => {
  if (lastTheme === "paper") {
    return "terracotta";
  }

  if (lastTheme === "terracotta") {
    return "charcoal";
  }

  return "paper";
};

const ORDER_BY = {
  newest: [{ createdAt: "desc" }],
  oldest_verified: [{ verifiedAt: "asc" }],
  unposted_first: [
    { lastPostedAt: { nulls: "first", sort: "asc" } },
    { createdAt: "desc" },
  ],
} satisfies Record<
  "newest" | "unposted_first" | "oldest_verified",
  Prisma.BirthdayPerkOrderByWithRelationInput[]
>;

const inputSchema = z.object({
  badge: perkBadgeSchema
    .optional()
    .describe("Filter by badge type: FREE or VOUCHER"),
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .default(20)
    .describe("Maximum number of perks to retrieve (up to 100)"),
  search: z
    .string()
    .optional()
    .describe("Keyword search matching brand name or headline"),
  sortBy: z
    .enum(["newest", "unposted_first", "oldest_verified"])
    .default("newest")
    .describe(
      "Sort order: 'newest' (default createdAt desc), 'unposted_first' (never/least-recently featured on social media first), or 'oldest_verified' (stalest verifiedAt first for weekly verification)"
    ),
  status: perkStatusSchema
    .default("PUBLISHED")
    .describe("Status of perks to retrieve"),
});

export const createGetBrandPerksTool = (description: string) =>
  defineTool({
    description,
    execute: async ({ badge, limit, search, sortBy, status }) => {
      const where: Prisma.BirthdayPerkWhereInput = {
        status,
      };

      if (badge) {
        where.badge = badge;
      }

      if (search) {
        where.OR = [
          { brand: { name: { contains: search, mode: "insensitive" } } },
          { headline: { contains: search, mode: "insensitive" } },
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
        perks: perks.map((p) => ({
          appStoreUrl: p.brand.appStoreUrl,
          badge: p.badge,
          brandName: p.brand.name,
          brandSlug: p.brand.slug,
          googleMapUrl: p.brand.googleMapUrl,
          headline: p.headline,
          howToRedeem: p.howToRedeem,
          lastPostedAt: p.lastPostedAt,
          lastTheme: p.lastTheme,
          logoUrl: p.brand.logoUrl,
          perksList: p.perksList,
          playStoreUrl: p.brand.playStoreUrl,
          termsConditions: p.termsConditions,
          validity: p.validity,
          verifiedAt: p.verifiedAt,
          websiteUrl: p.brand.websiteUrl,
        })),
      };
    },
    inputSchema,
  });
