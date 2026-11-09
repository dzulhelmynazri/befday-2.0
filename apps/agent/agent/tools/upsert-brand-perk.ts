import { upsertBrandPerkSchema } from "@befday-2.0/contracts";
import type { PerkStatus } from "@befday-2.0/db";
import { defineTool } from "eve/tools";
import { auto } from "eve/tools/approval";
import slugify from "slugify";

import { db } from "@/lib/db";

export interface UpsertBrandPerkResult {
  readonly brandId: string;
  readonly brandSlug: string;
  readonly perkId: string;
  readonly status: PerkStatus;
  readonly success: boolean;
}

export default defineTool({
  approval: auto({
    instructions:
      "Check that this birthday perk describes credible rewards and authentic merchant links. Return clear for verified perks. Return caution if it claims implausible freebies without source URLs.",
  }),
  description:
    "Saves or updates a brand and its birthday perk details in the database.",
  async execute(input): Promise<UpsertBrandPerkResult> {
    const brandSlug = slugify(input.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const brandData = {
      appStoreUrl: input.appStoreUrl,
      description: input.description,
      googleMapUrl: input.googleMapUrl,
      logoUrl: input.logoUrl,
      name: input.name,
      playStoreUrl: input.playStoreUrl,
      websiteUrl: input.websiteUrl,
    };

    const brand = await db.brand.upsert({
      create: {
        ...brandData,
        slug: brandSlug,
      },
      update: brandData,
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
