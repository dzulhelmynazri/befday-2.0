import { protectedProcedure, publicProcedure, router } from "../index";
import { blogRouter } from "./blog";
import { partnerRouter } from "./partner";
import { perkRouter } from "./perk";
import { userRouter } from "./user";

export const appRouter = router({
  blog: blogRouter,
  healthCheck: publicProcedure.query(() => "OK"),
  partner: partnerRouter,
  perk: perkRouter,
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
  user: userRouter,
});

export type AppRouter = typeof appRouter;
