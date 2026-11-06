import { upsertBlogPostSchema } from "@befday-2.0/contracts";
import { defineTool } from "eve/tools";
import slugify from "slugify";

import { db } from "@/lib/db";

export default defineTool({
  description:
    "Save or update an SEO blog post or birthday guide in the database",
  execute: async (input) => {
    const slug = slugify(input.slug, {
      lower: true,
      strict: true,
      trim: true,
    });

    const post = await db.blogPost.upsert({
      create: {
        content: input.content,
        coverImageUrl: input.coverImageUrl,
        description: input.description,
        publishedAt: input.publishedAt,
        slug,
        status: input.status,
        tags: input.tags,
        title: input.title,
      },
      update: {
        content: input.content,
        coverImageUrl: input.coverImageUrl,
        description: input.description,
        publishedAt: input.publishedAt,
        status: input.status,
        tags: input.tags,
        title: input.title,
      },
      where: { slug },
    });

    return {
      id: post.id,
      publishedAt: post.publishedAt.toISOString(),
      slug: post.slug,
      status: post.status,
      title: post.title,
    };
  },
  inputSchema: upsertBlogPostSchema,
});
