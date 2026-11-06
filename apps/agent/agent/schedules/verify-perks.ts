import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Perform weekly verification of all published birthday perks in the database.
1. Check the official merchant website, rewards program, or loyalty app terms for each brand.
2. Confirm that the reward (FREE or VOUCHER), validity period, and redemption steps are still active and accurate.
3. Call upsert_brand_perk to update the record with fresh verification, keeping the status as PUBLISHED and refreshing the verifiedAt timestamp. If an offer has been discontinued by the merchant, update the status to EXPIRED.`,
  cron: "0 1 * * 1",
});
