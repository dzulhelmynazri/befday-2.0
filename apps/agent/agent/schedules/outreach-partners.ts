import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  content: `Delegate to the b2b-outreach subagent to run this week's partner outreach:
1. Call get_outreach_candidates and handle due follow-ups first, then uncontacted listed brands.
2. Research up to 5 brands with Treg, verify emails, and call send_partner_outreach once per brand.
3. Report which brands were emailed, which got a WhatsApp card, and which were skipped.`,
  cron: "0 2 * * 2",
});
