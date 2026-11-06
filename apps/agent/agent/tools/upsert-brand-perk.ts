import { upsertBrandPerkSchema } from "@befday-2.0/contracts";
import type { Prisma } from "@befday-2.0/db";
import { defineTool } from "eve/tools";
import slugify from "slugify";

import { db } from "../lib/db";

export default defineTool({
  description:
    "Saves or updates a brand and its birthday perk details in the database.",
  async execute(input) {
    const brandSlug = slugify(input.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const updateData: Prisma.BrandUpdateInput = {
      description: input.description,
      name: input.name,
    };

    if (input.logoUrl) {
      updateData.logoUrl = input.logoUrl;
    }

    if (input.websiteUrl) {
      updateData.websiteUrl = input.websiteUrl;
    }

    if (input.googleMapUrl) {
      updateData.googleMapUrl = input.googleMapUrl;
    }

    if (input.appStoreUrl) {
      updateData.appStoreUrl = input.appStoreUrl;
    }

    if (input.playStoreUrl) {
      updateData.playStoreUrl = input.playStoreUrl;
    }

    const brand = await db.brand.upsert({
      create: {
        appStoreUrl: input.appStoreUrl,
        description: input.description,
        googleMapUrl: input.googleMapUrl,
        logoUrl: input.logoUrl,
        name: input.name,
        playStoreUrl: input.playStoreUrl,
        slug: brandSlug,
        websiteUrl: input.websiteUrl,
      },
      update: updateData,
      where: { slug: brandSlug },
    });

    const existingPerk = await db.birthdayPerk.findFirst({
      orderBy: { updatedAt: "desc" },
      where: {
        brandId: brand.id,
      },
    });

    const perkData = {
      badge: input.badge,
      brandId: brand.id,
      headline: input.headline,
      howToRedeem: input.howToRedeem,
      perksList: input.perksList,
      sourceUrls: input.sourceUrls,
      status: input.status,
      termsConditions: input.termsConditions,
      validity: input.validity,
      verifiedAt: new Date(),
    };

    const perk = existingPerk
      ? await db.birthdayPerk.update({
          data: perkData,
          where: { id: existingPerk.id },
        })
      : await db.birthdayPerk.create({
          data: perkData,
        });

    return {
      brandId: brand.id,
      brandSlug: brand.slug,
      perkId: perk.id,
      status: perk.status,
      success: true,
    };
  },
  inputSchema: upsertBrandPerkSchema,
});
