import {
  featuredPerksQuerySchema,
  perkBySlugQuerySchema,
  perkListQuerySchema,
  updatePerkStatusSchema,
} from "@befday-2.0/contracts";
import type { Prisma } from "@befday-2.0/db";

import { protectedProcedure, publicProcedure, router } from "../index";

export const perkRouter = router({
  bySlug: publicProcedure
    .input(perkBySlugQuerySchema)
    .query(async ({ ctx, input }) => {
      const brand = await ctx.db.brand.findUnique({
        include: {
          perks: {
            orderBy: { createdAt: "desc" },
            where: { status: "PUBLISHED" },
          },
        },
        where: { slug: input.slug },
      });

      return brand;
    }),

  featured: publicProcedure
    .input(featuredPerksQuerySchema.optional())
    .query(({ ctx, input }) => {
      const { limit = 6 } = input ?? {};

      return ctx.db.birthdayPerk.findMany({
        include: {
          brand: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        where: {
          badge: "FREE",
          status: "PUBLISHED",
        },
      });
    }),

  list: publicProcedure
    .input(perkListQuerySchema.optional())
    .query(async ({ ctx, input }) => {
      const {
        badge,
        cursor,
        limit = 20,
        search,
        status = "PUBLISHED",
      } = input ?? {};

      const whereClause: Prisma.BirthdayPerkWhereInput = {
        status,
      };

      if (badge) {
        whereClause.badge = badge;
      }

      if (search) {
        whereClause.OR = [
          {
            brand: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          { headline: { contains: search, mode: "insensitive" } },
        ];
      }

      const items = await ctx.db.birthdayPerk.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          brand: true,
        },
        orderBy: { createdAt: "desc" },
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
    .input(updatePerkStatusSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.birthdayPerk.update({
        data: {
          status: input.status,
          verifiedAt: new Date(),
        },
        where: { id: input.perkId },
      })
    ),
});
