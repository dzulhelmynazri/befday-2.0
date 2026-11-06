import type { MetadataRoute } from "next";

import { getDb } from "@/services";
import { baseUrl } from "@/utils/base-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getDb();

  const [posts, perks] = await Promise.all([
    db.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      select: {
        publishedAt: true,
        slug: true,
        updatedAt: true,
      },
      where: { status: "PUBLISHED" },
    }),
    db.birthdayPerk.findMany({
      include: {
        brand: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      where: { status: "PUBLISHED" },
    }),
  ]);

  const perkPages: MetadataRoute.Sitemap = perks.map((perk) => ({
    changeFrequency: "weekly",
    lastModified: perk.updatedAt,
    priority: 0.8,
    url: `${baseUrl}/perks/${perk.brand.slug}`,
  }));

  const blogs: MetadataRoute.Sitemap = posts.map((post) => ({
    changeFrequency: "weekly",
    lastModified: post.updatedAt ?? post.publishedAt,
    priority: 0.8,
    url: `${baseUrl}/blog/${post.slug}`,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1,
      url: `${baseUrl}`,
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseUrl}/blog`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: `${baseUrl}/privacy-policy`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: `${baseUrl}/terms-of-service`,
    },
  ];

  return [...staticRoutes, ...perkPages, ...blogs];
}
