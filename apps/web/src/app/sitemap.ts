import type { MetadataRoute } from "next";

import { getDb } from "@/services";
import { baseUrl } from "@/utils/base-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getDb();

  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      publishedAt: true,
      slug: true,
      updatedAt: true,
    },
    where: { status: "PUBLISHED" },
  });

  const blogs: MetadataRoute.Sitemap = posts.map((post) => ({
    changeFrequency: "weekly",
    lastModified: post.updatedAt ?? post.publishedAt,
    priority: 0.8,
    url: `${baseUrl}/blog/${post.slug}`,
  }));

  const routes: MetadataRoute.Sitemap = ["", "/blog"].map((route) => ({
    changeFrequency: "daily",
    lastModified: new Date(),
    priority: route === "" ? 1 : 0.9,
    url: `${baseUrl}${route}`,
  }));

  return [...routes, ...blogs];
}
