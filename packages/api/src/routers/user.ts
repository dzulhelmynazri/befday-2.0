import { completeProfileSchema } from "@befday-2.0/contracts";

import { protectedProcedure, router } from "../index";

export const userRouter = router({
  completeProfile: protectedProcedure
    .input(completeProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const birthDate = new Date(`${input.dateOfBirth}T00:00:00Z`);
      const birthMonth = birthDate.getUTCMonth() + 1;
      const birthDay = birthDate.getUTCDate();

      const user = await ctx.db.user.update({
        data: {
          birthDay,
          birthMonth,
          dateOfBirth: birthDate,
          name: input.name,
        },
        select: {
          birthDay: true,
          birthMonth: true,
          dateOfBirth: true,
          email: true,
          id: true,
          image: true,
          name: true,
        },
        where: { id: ctx.session.user.id },
      });

      return {
        success: true,
        user,
      };
    }),
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      select: {
        birthDay: true,
        birthMonth: true,
        dateOfBirth: true,
        email: true,
        id: true,
        image: true,
        name: true,
      },
      where: { id: ctx.session.user.id },
    });

    return {
      isOnboarded: Boolean(user?.dateOfBirth),
      user,
    };
  }),
});
