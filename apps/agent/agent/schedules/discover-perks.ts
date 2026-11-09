import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Discover newly launched or uncataloged birthday perks, treats, and vouchers across food & beverage, entertainment, retail, and leisure brands in Malaysia.
1. Call get_brand_perks(limit: 100) first to inspect which brands are already cataloged so you do not re-research existing brands.
2. Use search and scrape integrations to find newly announced loyalty birthday rewards for uncataloged brands.
3. For each discovered brand, resolve official websiteUrl, logoUrl, appStoreUrl, playStoreUrl, and googleMapUrl.
4. Classify badge strictly as FREE (no purchase needed) or VOUCHER (requires purchase or spend).
5. Persist newly discovered perks using upsert_brand_perk. Use PUBLISHED if verified directly from the merchant official source, or DRAFT if editorial review is needed.`,
  cron: "0 2 * * 3",
});
