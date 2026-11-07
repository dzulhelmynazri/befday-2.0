import { z } from "zod";

export const completeProfileSchema = z.object({
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, "Date of birth must be in YYYY-MM-DD format")
    .refine((val) => {
      const dob = new Date(`${val}T00:00:00Z`);

      if (Number.isNaN(dob.getTime())) {
        return false;
      }

      const today = new Date();

      if (dob >= today) {
        return false;
      }

      let age = today.getUTCFullYear() - dob.getUTCFullYear();
      const monthDiff = today.getUTCMonth() - dob.getUTCMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())
      ) {
        age -= 1;
      }

      return age >= 13 && age <= 120;
    }, "You must be at least 13 years old"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters"),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
