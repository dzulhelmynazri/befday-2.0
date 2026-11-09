import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Delegate to the social-publisher subagent to feature verified birthday perks that have never been posted (or were posted least recently) using get_brand_perks(sortBy: "unposted_first"):
1. Use the returned nextTheme ('paper' -> 'terracotta' -> 'charcoal') when calling generate_carousel_slides.
2. Pass featured brandSlugs and theme to schedule_social_post so lastPostedAt and lastTheme are recorded in the database.`,
  cron: "0 3 * * 5",
});
