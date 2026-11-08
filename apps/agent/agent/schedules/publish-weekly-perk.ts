import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Select one featured, verified birthday perk from the catalog for the upcoming weekend and delegate to the social-publisher subagent to draft and schedule multi-channel social media posts via NeuLink.`,
  cron: "0 3 * * 5",
});
