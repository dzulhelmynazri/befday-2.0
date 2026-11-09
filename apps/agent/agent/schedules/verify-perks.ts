import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Perform weekly verification of published birthday perks in the database starting with the stalest records:
1. Call get_brand_perks(status: "PUBLISHED", sortBy: "oldest_verified", limit: 50) to retrieve the least-recently verified perks first.
2. Check the official merchant website, rewards program, or loyalty app terms for each brand.
3. Call check_perk_active with the scraped text to determine if the perk is still active, expired, or needs review.
4. Call upsert_brand_perk to update the record with fresh verification, using the recommended status (PUBLISHED or EXPIRED) and refreshing verifiedAt.`,
  cron: "0 1 * * 1",
});
