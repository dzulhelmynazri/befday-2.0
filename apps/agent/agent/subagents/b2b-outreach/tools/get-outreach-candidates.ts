import { defineTool } from "eve/tools";
import { z } from "zod";

import { db } from "@/lib/db";

const FOLLOW_UP_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_STEP = 3;

export default defineTool({
  description:
    "Lists outreach work: listed brands never contacted (for CLAIM_LISTING or FEATURED_SPONSORSHIP), past outreach due for a follow-up, and every brand slug already contacted so new-brand research skips them.",
  async execute({ limit }) {
    const contacted = await db.partnerOutreach.findMany({
      select: { brandSlug: true },
    });

    const contactedSlugs = contacted.map((o) => o.brandSlug);

    const [uncontactedBrands, followUps] = await Promise.all([
      db.brand.findMany({
        include: {
          perks: {
            orderBy: { updatedAt: "desc" },
            select: { headline: true, perksList: true, status: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        where: { slug: { notIn: contactedSlugs } },
      }),
      db.partnerOutreach.findMany({
        orderBy: { lastContactedAt: "asc" },
        take: limit,
        where: {
          lastContactedAt: {
            lt: new Date(Date.now() - FOLLOW_UP_COOLDOWN_MS),
          },
          status: { in: ["EMAIL_SENT", "WHATSAPP_QUEUED"] },
          step: { lt: MAX_STEP },
        },
      }),
    ]);

    return {
      contactedSlugs,
      followUps: followUps.map((o) => ({
        angle: o.angle,
        brandName: o.brandName,
        brandSlug: o.brandSlug,
        contactEmail: o.contactEmail,
        contactName: o.contactName,
        contactPhone: o.contactPhone,
        lastContactedAt: o.lastContactedAt,
        nextStep: o.step + 1,
        websiteUrl: o.websiteUrl,
      })),
      uncontactedBrands: uncontactedBrands.map((b) => ({
        brandName: b.name,
        brandSlug: b.slug,
        perk: b.perks[0] ?? null,
        websiteUrl: b.websiteUrl,
      })),
    };
  },
  inputSchema: z.object({
    limit: z
      .number()
      .int()
      .positive()
      .max(50)
      .default(10)
      .describe("Maximum rows per list"),
  }),
});
