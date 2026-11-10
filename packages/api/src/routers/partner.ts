import { submitPartnerPerkSchema } from "@befday-2.0/contracts";
import slugify from "slugify";

import { publicProcedure, router } from "../index";

export const partnerRouter = router({
  submit: publicProcedure
    .input(submitPartnerPerkSchema)
    .mutation(async ({ ctx, input }) => {
      const brandSlug = slugify(input.brandName, {
        lower: true,
        strict: true,
        trim: true,
      });

      const defaultLogo = `https://api.dicebear.com/10.x/loops/svg?seed=${encodeURIComponent(
        input.brandName
      )}`;

      const brand = await ctx.db.brand.upsert({
        create: {
          appStoreUrl: input.appStoreUrl || null,
          description: input.headline,
          googleMapUrl: input.googleMapUrl ?? "",
          logoUrl: defaultLogo,
          name: input.brandName,
          playStoreUrl: input.playStoreUrl || null,
          slug: brandSlug,
          websiteUrl: input.websiteUrl ?? "",
        },
        update: {
          appStoreUrl: input.appStoreUrl || undefined,
          googleMapUrl: input.googleMapUrl || undefined,
          name: input.brandName,
          playStoreUrl: input.playStoreUrl || undefined,
          websiteUrl: input.websiteUrl || undefined,
        },
        where: { slug: brandSlug },
      });

      const perksList = input.perksList
        .split(/[,;\n]/u)
        .map((s) => s.trim())
        .filter(Boolean);

      const perk = await ctx.db.birthdayPerk.create({
        data: {
          badge: input.badge,
          brandId: brand.id,
          contactEmail: input.contactEmail,
          contactName: input.contactName,
          contactPhone: input.contactPhone,
          headline: input.headline,
          howToRedeem: [input.howToRedeem],
          perksList:
            perksList.length > 0 ? perksList : [input.perksList.trim()],
          status: "DRAFT",
          termsConditions: null,
          validity: input.validity,
        },
      });

      await ctx.db.partnerOutreach.updateMany({
        data: { status: "CONVERTED" },
        where: {
          OR: [{ brandSlug }, { contactEmail: input.contactEmail }],
        },
      });

      await ctx.startPartnerSubmissionWorkflow(perk.id);

      return {
        brandName: brand.name,
        brandSlug: brand.slug,
        id: perk.id,
        success: true,
      };
    }),
});
