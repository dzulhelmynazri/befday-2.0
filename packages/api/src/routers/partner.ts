import { submitPartnerPerkSchema } from "@befday-2.0/contracts";
import { renderPartnerSubmissionReceivedEmail } from "@befday-2.0/email";
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
          appStoreUrl: input.appStoreUrl ?? "",
          description: input.headline,
          googleMapUrl: input.googleMapUrl ?? "",
          logoUrl: defaultLogo,
          name: input.brandName,
          playStoreUrl: input.playStoreUrl ?? "",
          slug: brandSlug,
          websiteUrl: input.websiteUrl ?? "",
        },
        update: {
          appStoreUrl: input.appStoreUrl ?? undefined,
          googleMapUrl: input.googleMapUrl ?? undefined,
          name: input.brandName,
          playStoreUrl: input.playStoreUrl ?? undefined,
          websiteUrl: input.websiteUrl ?? undefined,
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
          perksList: perksList.length > 0 ? perksList : [input.headline],
          status: "DRAFT",
          termsConditions: null,
          validity: input.validity,
        },
      });

      // Dispatch Telegram notification
      const { env } = ctx;
      const approveUrl = `${env.NEXT_PUBLIC_SITE_URL}/api/perks/approve?id=${perk.id}`;

      const lines = [
        `🎉 *New Merchant Perk Submission!*`,
        ``,
        `🏢 *Brand*: ${input.brandName}`,
        `🎁 *Perk*: ${input.headline}`,
        `🏷️ *Badge*: ${input.badge}`,
        `📅 *Validity*: ${input.validity}`,
        `📱 *Redeem*: ${input.howToRedeem}`,
        `👤 *Contact*: ${input.contactName} (${input.contactEmail} | ${input.contactPhone})`,
        input.websiteUrl ? `🔗 *Website*: ${input.websiteUrl}` : "",
        input.googleMapUrl ? `📍 *Location*: ${input.googleMapUrl}` : "",
        input.appStoreUrl ? `🍎 *App Store*: ${input.appStoreUrl}` : "",
        input.playStoreUrl ? `🤖 *Play Store*: ${input.playStoreUrl}` : "",
        ``,
        `*Status*: Saved as DRAFT (id: \`${perk.id}\`)`,
      ].filter(Boolean);

      await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "✅ Approve & Publish",
                    url: approveUrl,
                  },
                ],
              ],
            },
            text: lines.join("\n"),
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );

      // Send confirmation email to partner contact
      const { html, text } = await renderPartnerSubmissionReceivedEmail({
        brandName: input.brandName.toLowerCase(),
        contactName: input.contactName.toLowerCase(),
      });

      await ctx.email.send({
        from: "befday <hello@befday.com>",
        html,
        subject: `we received your submission for ${input.brandName.toLowerCase()} on befday`,
        text,
        to: input.contactEmail,
      });

      return {
        brandName: brand.name,
        brandSlug: brand.slug,
        id: perk.id,
        success: true,
      };
    }),
});
