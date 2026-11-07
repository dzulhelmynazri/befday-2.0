import { NextResponse } from "next/server";

import { getDb } from "@/services";
import { baseUrl } from "@/utils/base-url";

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
      select: {
        description: true,
        slug: true,
        title: true,
      },
      where: { status: "PUBLISHED" },
    }),
  ]);

  const activeBrands = brands.filter((b) => b.perks.length > 0);

  let markdown = "# befday\n\n";
  markdown +=
    "> Curated birthday perks, free treats, secret vouchers, and step-by-step redemption guides in Malaysia.\n\n";
  markdown += "## Overview\n";
  markdown +=
    "befday is an open, verified directory of birthday treats across dining, coffee, entertainment, convenience stores, and attractions in Malaysia.\n\n";

  markdown += "## Main Sections\n";
  markdown += `- [Homepage](${baseUrl}/): All verified birthday perks and freebies\n`;
  markdown += `- [Blog](${baseUrl}/blog): In-depth strategy guides, redemption walkthroughs, and tips\n`;
  markdown += `- [Full Knowledge Base](${baseUrl}/llms-full.txt): Comprehensive database of perks, rules, and redemption steps\n\n`;

  markdown += "## Verified Birthday Perks\n";

  for (const brand of activeBrands) {
    const [perk] = brand.perks;

    if (!perk) {
      continue;
    }

    const details =
      perk.headline || perk.perksList.join(", ") || brand.description;

    const validity = perk.validity ? ` (${perk.validity})` : "";
    markdown += `- [${brand.name.toLowerCase()}](${baseUrl}/perks/${brand.slug}): ${details.toLowerCase()}${validity.toLowerCase()}\n`;
  }

  if (posts.length > 0) {
    markdown += "\n## Guides & Articles\n";

    for (const post of posts) {
      markdown += `- [${post.title.toLowerCase()}](${baseUrl}/blog/${post.slug}): ${post.description.toLowerCase()}\n`;
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
