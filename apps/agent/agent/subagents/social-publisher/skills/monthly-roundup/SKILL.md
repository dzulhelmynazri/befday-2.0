---
name: monthly-roundup
description: Playbook for drafting beginning-of-the-month mega-announcements, category roundups, and multi-post threads celebrating everyone born in the upcoming month.
---

# Monthly Roundup Editorial Skill

Use this skill when drafting monthly celebration announcements, first-of-the-month megathreads, and comprehensive birth-month perk roundups (e.g., _"Happy Birthday November Babies! 🎉 Here are all 20+ free treats you can claim this month"_).

---

## 1. Intent & Campaign Strategy

The monthly roundup is a high-viral, recurring campaign published on the **1st of every month**. It drives massive organic shares because:

1. People actively tag friends born in that specific month.
2. It aggregates multiple treats into a single, high-utility resource.
3. It creates urgency by highlighting the **"Next-Month Reminder"** (urging people born _next_ month to register their apps before the 30-day cut-off).

---

## 2. Multi-Post Thread Formula (Threads / X)

For threaded platforms (Threads, X), format as a numbered chain:

### Post 1: The Celebratory Megathread Hook

> _"Happy Birthday [Month] celebrants! 🎂🎉_
>
> _You can claim over [Count]+ free meals, drinks, desserts, and movie tickets in Malaysia throughout this entire month._
>
> _Here is the ultimate cheat sheet of 100% free treats & vouchers you shouldn't miss 👇 🧵"_

### Post 2: Free Drinks & Cafes ☕

- List 3–4 top beverage perks (e.g., FamilyMart free Sofuto, Starbucks, Boost Juice, Gong Cha).
- Mention if purchase is required (`FREE` vs `VOUCHER`).

### Post 3: Free Food & Meals 🍔

- List free birthday meals, buffet treats, and main course promotions.
- State whether dine-in ID check or app voucher is required.

### Post 4: Free Entertainment & Leisure 🎬

- List free cinema tickets (GSC, TGV), karaoke, or theme park passes.

### Post 5: The "Next-Month" 30-Day Warning ⚠️

> _"🚨 Crucial PSA for [Next Month] babies:_ _Most loyalty apps (Starbucks, FamilyMart, etc.) require registering your account at least 30 days before your birth month._ _If your birthday is in [Next Month], download their apps TODAY so your vouchers drop on time!"_

### Post 6: Final Call to Action 📲

> _"Bookmark this thread for your celebrations!_ _Explore the complete verified catalog of 100+ Malaysia birthday rewards with direct app links on befday.com (link in bio) 🎁"_

---

## 3. Single Long-Form Post Formula (Facebook & LinkedIn)

For Facebook Pages and LinkedIn:

1. **Headline Hook**: Catchy headline celebrating `[Month]` birthdays.
2. **Categorized Breakdown**:
   - 🎁 **Top 100% Free Perks (Zero Spend)**: Bullet list.
   - 🏷️ **Best Birthday Vouchers & Discounts**: Bullet list.
3. **The 30-Day Registration Rule**: Warning callout.
4. **Call to Action**: Prompt users to tag a `[Month]` celebrant and visit `befday.com`.

---

## 4. Execution Step

1. Query `get_brand_perks` with `status: "PUBLISHED"` to gather 10–15 verified perks across diverse categories (Food, Drinks, Entertainment, Retail).
2. Synthesize into either a multi-post thread format or a unified long-form announcement.
3. Schedule via `schedule_social_post` targeting `threads`, `facebook_page`, `instagram`, and `linkedin`.
