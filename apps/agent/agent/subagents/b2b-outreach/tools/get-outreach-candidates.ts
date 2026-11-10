import type { OutreachAngle, PerkStatus } from "@befday-2.0/db";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { db } from "@/lib/db";

const FOLLOW_UP_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_STEP = 3;

const getOutreachCandidatesSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .default(10)
    .describe("Maximum rows per list"),
});

export interface OutreachCandidateFollowUp {
  readonly angle: OutreachAngle;
  readonly brandName: string;
  readonly brandSlug: string;
  readonly contactEmail: string | null;
  readonly contactName: string | null;
  readonly contactPhone: string | null;
  readonly lastContactedAt: Date;
  readonly nextStep: number;
  readonly websiteUrl: string;
}

export interface UncontactedBrandPerkSummary {
  readonly headline: string;
  readonly perksList: readonly string[];
  readonly status: PerkStatus;
}

export interface UncontactedBrandCandidate {
  readonly brandName: string;
  readonly brandSlug: string;
  readonly perk: UncontactedBrandPerkSummary | null;
  readonly websiteUrl: string;
}

export interface GetOutreachCandidatesResult {
  readonly contactedSlugs: readonly string[];
  readonly followUps: readonly OutreachCandidateFollowUp[];
  readonly uncontactedBrands: readonly UncontactedBrandCandidate[];
}

export default defineTool({
  description:
    "Lists outreach work: listed brands never contacted (for CLAIM_LISTING or FEATURED_SPONSORSHIP), past outreach due for a follow-up, and every brand slug already contacted so new-brand research skips them.",
  execute: async ({ limit }): Promise<GetOutreachCandidatesResult> => {
    const contacted = await db.partnerOutreach.findMany({
      select: { brandSlug: true },
    });

    const contactedSlugs = contacted.map((outreach) => outreach.brandSlug);

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
      followUps: followUps.map((outreach) => ({
        angle: outreach.angle,
        brandName: outreach.brandName,
        brandSlug: outreach.brandSlug,
        contactEmail: outreach.contactEmail,
        contactName: outreach.contactName,
        contactPhone: outreach.contactPhone,
        lastContactedAt: outreach.lastContactedAt,
        nextStep: outreach.step + 1,
        websiteUrl: outreach.websiteUrl,
      })),
      uncontactedBrands: uncontactedBrands.map((brand) => {
        const [perk] = brand.perks;

        return {
          brandName: brand.name,
          brandSlug: brand.slug,
          perk: perk
            ? {
                headline: perk.headline,
                perksList: perk.perksList,
                status: perk.status,
              }
            : null,
          websiteUrl: brand.websiteUrl,
        };
      }),
    };
  },
  inputSchema: getOutreachCandidatesSchema,
});
