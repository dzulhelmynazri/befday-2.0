import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Discover newly launched or uncataloged birthday perks, treats, and vouchers across food & beverage, entertainment, retail, and leisure brands in Malaysia.
1. Use search and scrape integrations to find newly announced loyalty birthday rewards.
2. For each discovered brand, resolve official websiteUrl, logoUrl, appStoreUrl, playStoreUrl, and googleMapUrl.
3. Classify badge strictly as FREE (no purchase needed) or VOUCHER (requires purchase or spend).
4. Persist newly discovered perks using upsert_brand_perk. Use PUBLISHED if verified directly from the merchant official source, or DRAFT if editorial review is needed.`,
  cron: "0 2 * * 3",
});
