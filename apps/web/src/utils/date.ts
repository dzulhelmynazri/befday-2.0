import { TZDate } from "@date-fns/tz";
import { addDays, format } from "date-fns";

export const APP_TIMEZONE = "Asia/Kuala_Lumpur";

export const getLocalDate = (date: Date | string = new Date()): TZDate =>
  new TZDate(new Date(date), APP_TIMEZONE);

export const getLocalDateParts = (date: Date | string = new Date()) => {
  const local = getLocalDate(date);

  return {
    day: local.getDate(),
    month: local.getMonth() + 1,
    year: local.getFullYear(),
  };
};

export const addLocalDays = (date: Date, days: number): TZDate =>
  addDays(getLocalDate(date), days);

export const getLocalMonthName = (date: Date = new Date()): string =>
  format(getLocalDate(date), "MMMM").toLowerCase();

export const formatDate = (date: Date | string): string =>
  format(new Date(date), "MMMM d, yyyy");

export const formatShortDate = (date: Date | string): string =>
  format(new Date(date), "MMM d, yyyy");
