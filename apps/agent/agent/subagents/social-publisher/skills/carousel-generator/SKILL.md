---
name: carousel-generator
description: Playbook for generating minimalist, high-save 1080x1350 Image Carousels ('Brand - Short Reward') for Instagram Carousels and TikTok Photo Mode using generate_carousel_slides.
---

# Carousel Generator Skill (Instagram & TikTok Photo Mode)

Use this skill when creating swipeable multi-slide image carousels for **Instagram Carousels** and **TikTok Photo Mode** (e.g., _"Top 7 Birthday Freebies in Malaysia"_, _"5 Free Birthday Desserts"*, or single-card Apple Notes cheat sheets).

---

## 1. Golden Rule: Minimalist `Brand - Short Reward` Only

- **Never put full claim instructions on carousel slides.**
- Keep every item ultra-short: **`Brand - Short Reward`** (2–4 words for the reward):
  - `Zus Coffee - Free cake`
  - `FamilyMart - Free Sofuto`
  - `Baskin Robbins - Free single scoop`
  - `Boost Juice - Free drink`
- Why: Minimalist slides swipe faster, look clean on mobile, and drive curiosity clicks to `befday.com` (link in bio) for the full redemption steps and app download links.

---

## 2. Visual Templates & 3-Column Grid Themes (`generate_carousel_slides`)

Choose both `template` and `theme` in `generate_carousel_slides` to maintain a memorable 3-column profile grid on Instagram and TikTok (see `brand-guidelines` skill):

### Templates (`template`)

1. **`brand_carousel` (Multi-Slide Swipeable Deck)**:
   - **Slide 1 (Cover Slide)**: Editorial card with `tag` pill (`BIRTHDAY PERKS`), bold `campaignTitle`, `subheadline`, and signature `befday.com` pill footer inside the 3-column thumbnail safe zone.
   - **Slides 2 to N (Minimalist Brand Slides)**: Bold centered `Brand - Reward` text (e.g. `Zus Coffee - Free cake`) + `Full claim steps at befday.com` footer.
2. **`notes_cheat_sheet` (Single-Card Cheat Sheet)**:
   - Renders a single cheat-sheet card (e.g. `"November Birthday Treats"`) with a clean flat list of `Brand - Short Reward` lines and the signature `befday.com` footer.

### 3-Column Grid Themes (`theme`)

Rotate `theme` across posts so the 3-column Instagram/TikTok profile grid forms a cohesive branded pattern:

- **`paper`** (`#faf9f5` warm editorial cream + `#181614` ink + `#c96442` terracotta pill): Best for category & niche roundups (Column 1).
- **`terracotta`** (`#c96442` signature brand orange cover + `#faf9f5` warm paper interior slides): Best for monthly hero drops (Column 2).
- **`charcoal`** (`#262624` warm dark card + `#d97757` terracotta pill): Best for `notes_cheat_sheet` lists & secret perks (Column 3).

---

## 3. Accompanying Caption Formula

### For Instagram:

1. **Opening Hook**: 1 punchy sentence matching Slide 1 (e.g., _"Save this before your birthday month arrives! 🎂"_).
2. **Quick Summary**: Short 1-liner list (`Brand - Short Reward`).
3. **CTA & Hashtags**: _"Tag a birthday celebrant below! Full claim steps & app links at befday.com (link in bio)."* + 5–8 hashtags (`#birthdayfreebies #malaysiadeals #klfoodie #freebies #befday`).

### For TikTok (Photo Mode):

1. **Short Punchy Hook** (< 150 characters): _"Swipe for birthday treats in Malaysia 👉 Save siap-siap! Full claim steps at befday.com 🎂"_
2. **Trending Tags**: `#birthdayfreebies #malaysiahacks #fooddeals #klfoodie #befday`

---

## 4. Execution Workflow

1. Call `get_brand_perks` (`status: "PUBLISHED"`) to retrieve verified brands, badges (`FREE` vs `VOUCHER`), and perks.
2. Condense each reward into a 2–4 word phrase (e.g. `"Free cake"`, `"Free Sofuto"`, `"RM10 drink voucher"`).
3. Call `generate_carousel_slides` to render PNG slides to Cloudflare R2 and receive `mediaUrls`.
4. Call `schedule_social_post` passing `mediaUrls` and targeting `["instagram", "tiktok"]`.
