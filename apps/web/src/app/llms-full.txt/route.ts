import { NextResponse } from "next/server";

import { getDb } from "@/services";
import { baseUrl } from "@/utils/base-url";
import { formatShortDate } from "@/utils/date";

export const revalidate = 3600;

export const GET = async () => {
  const db = getDb();

  const [brands, posts] = await Promise.all([
    db.brand.findMany({
      include: {
        perks: {
          orderBy: { createdAt: "desc" },
          where: { status: "PUBLISHED" },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      where: { status: "PUBLISHED" },
    }),
  ]);

  const activeBrands = brands.filter((b) => b.perks.length > 0);

  let markdown = "# befday — Complete Knowledge Base\n\n";
  markdown +=
    "> Verified birthday perks, redemption rules, validity, and step-by-step guides for Malaysia.\n\n";
  markdown += `Canonical Source: ${baseUrl}\n\n`;

  markdown += "## Verified Brands & Birthday Perks\n\n";

  for (const brand of activeBrands) {
    const [perk] = brand.perks;

    if (!perk) {
      continue;
    }

    markdown += `### ${brand.name.toLowerCase()}\n`;
    markdown += `- URL: ${baseUrl}/perks/${brand.slug}\n`;
    markdown += `- Type: ${perk.badge === "FREE" ? "100% Free Treat" : "Discount Voucher"}\n`;
    markdown += `- Headline: ${perk.headline}\n`;
    markdown += `- Validity: ${perk.validity}\n`;
    markdown += `- Last Verified: ${formatShortDate(perk.verifiedAt)}\n`;

    if (brand.websiteUrl) {
      markdown += `- Official Website: ${brand.websiteUrl}\n`;
    }

    if (perk.perksList.length > 0) {
      markdown += "- Perks Details:\n";

      for (const item of perk.perksList) {
        markdown += `  - ${item}\n`;
      }
    }

    if (perk.howToRedeem.length > 0) {
      markdown += "- Step-by-Step How to Redeem:\n";

      for (const [idx, step] of perk.howToRedeem.entries()) {
        markdown += `  ${idx + 1}. ${step}\n`;
      }
    }

    if (perk.termsConditions) {
      markdown += `- Terms & Conditions: ${perk.termsConditions}\n`;
    }

    markdown += "\n---\n\n";
  }

  if (posts.length > 0) {
    markdown += "## Published Guides\n\n";

    for (const post of posts) {
      markdown += `### ${post.title.toLowerCase()}\n`;
      markdown += `- URL: ${baseUrl}/blog/${post.slug}\n`;
      markdown += `- Published: ${formatShortDate(post.publishedAt)}\n`;
      markdown += `- Summary: ${post.description}\n\n`;
    }
  }

  return new NextResponse(markdown, {
    headers: {
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
