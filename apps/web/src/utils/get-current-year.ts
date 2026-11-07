"use cache";

import { cacheLife } from "next/cache";

export const getCurrentYear = async (): Promise<number> => {
  cacheLife("days");

  return await Promise.resolve(new Date().getFullYear());
};
