import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Select one featured, verified birthday perk from the catalog for the upcoming weekend.
1. Formulate an engaging, concise social and channel broadcast post highlighting the brand, the free reward or discount voucher, validity period, and quick redemption steps.
2. Schedule or publish the post using schedule_social_post to broadcast across channels.`,
  cron: "0 3 * * 5",
});
