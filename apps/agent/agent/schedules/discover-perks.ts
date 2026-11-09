import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Discover newly launched or uncataloged birthday perks, treats, and vouchers across food & beverage, entertainment, retail, and leisure brands in Malaysia.
1. Call get_brand_perks(limit: 100) first to inspect which brands are already cataloged so you do not re-research existing brands.
2. Search for newly announced loyalty birthday rewards using Treg. Use filter_search_leads to filter out irrelevant links before scraping pages.
3. For each discovered brand, resolve official websiteUrl, logoUrl, appStoreUrl, playStoreUrl, and googleMapUrl.
4. Classify badge strictly as FREE or VOUCHER using classify_brand_perk.
5. Persist newly discovered perks using upsert_brand_perk. Use PUBLISHED if verified directly from the merchant official source, or DRAFT if editorial review is needed.`,
  cron: "0 2 * * 3",
});
