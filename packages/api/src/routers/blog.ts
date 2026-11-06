import {
  blogBySlugQuerySchema,
  blogListQuerySchema,
  updateBlogStatusSchema,
} from "@befday-2.0/contracts";
import type { Prisma } from "@befday-2.0/db";

import { protectedProcedure, publicProcedure, router } from "../index";

export const blogRouter = router({
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      where: { status: "PUBLISHED" },
    })
  ),

  bySlug: publicProcedure.input(blogBySlugQuerySchema).query(({ ctx, input }) =>
    ctx.db.blogPost.findUnique({
      where: { slug: input.slug, status: "PUBLISHED" },
    })
  ),

  list: publicProcedure
    .input(blogListQuerySchema.optional())
    .query(async ({ ctx, input }) => {
      const {
        cursor,
        limit = 10,
        search,
        status = "PUBLISHED",
        tag,
      } = input ?? {};

      const whereClause: Prisma.BlogPostWhereInput = {
        status,
      };

      if (tag) {
        whereClause.tags = { has: tag };
      }

      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const items = await ctx.db.blogPost.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { publishedAt: "desc" },
        take: limit + 1,
        where: whereClause,
      });

      let nextCursor: string | undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  updateStatus: protectedProcedure
    .input(updateBlogStatusSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.blogPost.update({
        data: {
          status: input.status,
        },
        where: { id: input.id },
      })
    ),
});
