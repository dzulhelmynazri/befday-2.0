---
name: social-publishing
description: Procedures and copywriting standards for drafting and scheduling birthday perk social media posts across supported channels via NeuLink.
---

# Social Media Publishing Skill

Use this skill when drafting, formatting, or scheduling social media posts for discovered birthday perks.

---

## Supported Channels

Only post to these 7 channels:

1. `instagram`
2. `tiktok`
3. `facebook_page`
4. `linkedin`
5. `threads`
6. `pinterest`
7. `google_business`

---

## 1. Tone & Voice

- **Celebratory & Punchy**: Tap into the excitement of birthday freebies.
- **Transparent**: Clearly state whether a perk is 100% free (`FREE`) or requires a purchase/coupon (`VOUCHER`).
- **Actionable**: Tell users exactly what step to take (e.g., _"Download the app"_, _"Show your ID at the counter"_).

---

## 2. Channel Copywriting Guidelines

### A. Instagram

- **Style**: Visual storytelling with line breaks and emoji bullet points.
- **Formula**:
  1. Attention-grabbing headline.
  2. Perks breakdown (bullet points with 🎁, 📅, 📱, 📍).
  3. Clear redemption step & validity.
  4. Call to Action: _"Tag a birthday celebrant below! Link in bio for 100+ more birthday freebies."_
  5. Targeted hashtags (5–8 tags).

### B. Threads

- **Style**: Conversational, witty, and concise (< 500 characters).
- **Formula**:
  - Direct deal alert hook + essential claim condition + link.
  - Example:
    > Birthday tip: A&W gives you a Free Root Beer during your birthday month 🍺 Claim it directly in their app. Who's celebrating this month?

### C. TikTok

- **Style**: Short, punchy video caption (< 150 characters) designed to complement a visual or video.
- **Formula**:
  - Hook + secret perk alert + 3–5 trending tags: `#birthdayfreebies #foodhacks #deals #freestuff`

### D. Facebook Page

- **Style**: Community-friendly deal announcement.
- **Formula**:
  - 1–2 friendly paragraphs explaining the offer, store locations, and a direct clickable link to the brand perk page.

### E. LinkedIn

- **Style**: Professional consumer & loyalty program analysis.
- **Formula**:
  - 2 short paragraphs highlighting how the brand drives customer retention and app adoption through birthday rewards.

### F. Pinterest

- **Style**: Search-optimized pin description rich with keywords.
- **Formula**:
  - Focus on keywords like _"Best Birthday Freebies"_, _"Birthday Month Perks"_, and _"Free Food on Your Birthday"_. Include a direct link back to the brand card.

### G. Google Business

- **Style**: Direct promotional offer update.
- **Formula**:
  - Concise "Offer/Update" style post with perk details, validity window, and a "Learn More" / "Redeem" call to action.

---

## 3. Media & Visuals

- Always include the generated brand card or official logo in `mediaUrls`.
- Never schedule text-only posts—visuals are required for Instagram, TikTok, Pinterest, and Google Business.

---

## 4. Execution Step

Call the `schedule_social_post` tool:

```json
{
  "text": "<formatted copy>",
  "channels": [
    "instagram",
    "threads",
    "facebook_page",
    "tiktok",
    "linkedin",
    "pinterest",
    "google_business"
  ],
  "mediaUrls": ["<image_url>"],
  "scheduledAt": "2026-11-10T10:00:00Z"
}
```

If `scheduledAt` is omitted, NeuLink queues the post for the next available slot.
