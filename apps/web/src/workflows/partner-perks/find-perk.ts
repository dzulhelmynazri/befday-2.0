import { getDb } from "@/services";

export const findPerkWithBrand = (perkId: string) =>
  getDb().birthdayPerk.findUnique({
    include: { brand: true },
    where: { id: perkId },
  });

