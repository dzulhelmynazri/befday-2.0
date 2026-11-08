---
name: monthly-roundup
description: Playbook for drafting high-share beginning-of-the-month viral cheat sheets and numbered 'Brand - Short Reward' stacks on Threads, X, Facebook, and LinkedIn.
---

# Monthly Roundup Editorial Skill

Use this skill when drafting monthly birthday cheat sheets and first-of-the-month megathreads (e.g., _"Geng lahir bulan November, boleh ready dah nak claim birthday reward korang!!"_ or _"November babies! Don't forget to redeem your birthday treats!"_).

---

## 1. Why This Format Goes Viral

On Threads and X, monthly birthday roundups achieve **80%–100%+ share-to-like ratios** when formatted as **zero-fluff, screenshot-able `Brand - Short Reward` lists** rather than marketing paragraphs:

1. **Instant Scan Value**: Readers can scan 10–15 brands in 5 seconds (`Zus Coffee - Free cake`).
2. **Curiosity to Click**: Keeping each line ultra-short drives clicks to `befday.com` for full redemption steps and app links.
3. **High DM & Tag Velocity**: People immediately forward the list to friends born in that month or bookmark it for themselves.

---

## 2. Two Proven Viral Threads Archetypes

Select one of these archetypes (or combine across a `1/3`, `2/3`, `3/3` thread):

### Archetype A: The "1-Liner Numbered Stack" (`1/3` Thread)

Best for maximum reach, likes, and swipe-throughs.

**Post 1/3 (Top Crowd Favorites)**:

```text
Geng lahir bulan [Month], boleh ready dah nak claim birthday reward korang!! 🎂✨

1. FamilyMart - Free Sofuto
2. Baskin Robbins - Free single scoop
3. Boost Juice - Free drink
4. Bungkus Kaw Kaw - Free Nasi Lemak + drink
5. Gong Cha - Free drink voucher
6. Coffee Bean - Free slice cake
7. Zus Coffee - Free cake
8. Nando's - Free birthday treat
9. Sushi King - Free dessert
10. 7-Eleven - Free Slurpee

(Sambungan part 2/3 bawah 👇)
```

**Post 2/3 (More Perks)**:

- Continue numbering `11.` to `20.` using the clean `Brand - Short Reward` format.

**Post 3/3 (Full Directory CTA)**:

```text
Nak tengok full list 100+ birthday treats siap dengan cara claim & link download app?
Terus pergi kat befday.com (link in bio) 🎁
```

---

### Archetype B: Single-Card Apple Notes Cheat Sheet

Best for maximum saves/bookmarks and shares. Attach a `notes_cheat_sheet` PNG generated via `generate_carousel_slides` with a clean flat list of `Brand - Short Reward` items:

```text
List untuk yang nak claim birthday treat bulan [Month].. Happy birthday [Month] buddies! 🥳

Full cara tebus & link app semua ada kat befday.com ✨
```

---

## 3. Execution Workflow

1. **Optional Trend Check (Treg MCP)**: Search `site:threads.net "birthday" "lahir bulan"` via Treg to see if any new merchant perk is trending this week.
2. **Query Database (`get_brand_perks`)**: Fetch `status: "PUBLISHED"` perks so every item on the list is 100% verified.
3. **Draft & Schedule (`schedule_social_post`)**: Format using one of the archetypes above and schedule across `threads`, `facebook_page`, `instagram`, and `linkedin`.
