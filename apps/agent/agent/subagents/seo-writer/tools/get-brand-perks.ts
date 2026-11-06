import { perkBadgeSchema, perkStatusSchema } from "@befday-2.0/contracts";
import type { Prisma } from "@befday-2.0/db";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { db } from "@/lib/db";

export default defineTool({
  description:
    "Fetch verified brands and birthday perks from the database to cite and feature in SEO blog posts",
  execute: async ({ badge, limit, search, status }) => {
    const whereClause: Prisma.BirthdayPerkWhereInput = {
      status,
    };

    if (badge) {
      whereClause.badge = badge;
    }

    if (search) {
      whereClause.OR = [
        { brand: { name: { contains: search, mode: "insensitive" } } },
        { headline: { contains: search, mode: "insensitive" } },
      ];
    }

    const perks = await db.birthdayPerk.findMany({
      include: {
        brand: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      where: whereClause,
    });

    return {
      count: perks.length,
      perks: perks.map((p) => ({
        appStoreUrl: p.brand.appStoreUrl,
        badge: p.badge,
        brandName: p.brand.name,
        brandSlug: p.brand.slug,
        googleMapUrl: p.brand.googleMapUrl,
        headline: p.headline,
        howToRedeem: p.howToRedeem,
        logoUrl: p.brand.logoUrl,
        perksList: p.perksList,
        playStoreUrl: p.brand.playStoreUrl,
        termsConditions: p.termsConditions,
        validity: p.validity,
        websiteUrl: p.brand.websiteUrl,
      })),
    };
  },
  inputSchema: z.object({
    badge: perkBadgeSchema
      .optional()
      .describe("Filter by reward badge: FREE or VOUCHER"),
    limit: z
      .number()
      .int()
      .positive()
      .max(50)
      .default(20)
      .describe("Maximum number of perks to retrieve"),
    search: z
      .string()
      .optional()
      .describe("Search term for brand name or perk headline"),
    status: perkStatusSchema
      .default("PUBLISHED")
      .describe("Status of perks to retrieve (defaults to PUBLISHED)"),
  }),
});
