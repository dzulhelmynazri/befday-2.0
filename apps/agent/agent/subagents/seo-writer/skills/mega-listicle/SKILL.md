---
name: mega-listicle
description: Editorial procedure and AI-SEO patterns for drafting comprehensive, multi-brand birthday freebie roundups, regional guides, and directory listicles.
---

# Mega-Listicle Editorial Skill

Use this skill when tasked with writing comprehensive, multi-merchant birthday guides (e.g., _"The Ultimate Birthday Freebies in Malaysia (2026)"_, _"Top 20 Birthday Treats in Kuala Lumpur"_, or category roundups like _"Best Birthday Drinks & Coffee"_).

---

## 1. Intent & Structure

A high-ranking mega-listicle captures broad commercial and informational intent. It must be effortlessly scannable for humans and easily extractable for AI search engines (Google AI Overviews, Perplexity, ChatGPT).

### Document Hierarchy:

```markdown
1. H1 Title & Meta Description (high CTR, targeted year)
2. Standalone Answer Capsule (40–60 words, direct summary)
3. High-Level Comparison Table (Scannable matrix)
4. Categorized Brand Spotlights (Grouped in ::grid with ::perk)
5. Pro-Tips / Traps to Avoid (Registration cut-offs, ID checks)
6. Frequently Asked Questions (PAA-driven, direct answers)
```

---

## 2. Section Playbook

### A. Title & Slug

- **Title Formula**: `[Number / "The Ultimate"] Birthday Freebies in [Country/City] ([Year] Edition)`
- **Slug**: `best-birthday-freebies-[country]-[year]` (e.g., `best-birthday-freebies-malaysia-2026`)
- **Meta Description**: 140–160 characters highlighting the total number of freebies and top brands.

### B. Standalone Answer Capsule (40–60 words)

- **Position**: Immediately beneath the title and a 1–2 sentence welcome hook.
- **Goal**: Win the snippet in Google AI Overviews and ChatGPT Search without burying the answer.
- **Template**:
  > _"Over [Count]+ popular brands in [Location] offer verified birthday rewards in [Year]. Top 100% free treats requiring no minimum spend include [Brand A]'s free [Perk] and [Brand B]'s free [Perk]. Most perks are valid for the entire birthday month via official loyalty mobile apps, though several merchants require membership registration at least 30 days in advance."_

### C. Quick-Scan Comparison Table

- Always include an upfront comparison table before deep categories:

| Brand | Birthday Perk | Type | Validity | App / Requirement |
| :-- | :-- | :-- | :-- | :-- |
| **Brand A** | Free drink | `FREE` | Birthday month | Official App |
| **Brand B** | 20% off bill | `VOUCHER` | Actual day only | Walk-in with ID |

### D. Categorized Brand Spotlights (Comark Directives)

Group by intuitive categories:

- **Food & Dining** (Meals, desserts, buffets)
- **Cafes & Beverages** (Coffee, bubble tea, juices)
- **Entertainment & Leisure** (Cinemas, karaoke, theme parks)
- **Retail & Shopping** (Shopping vouchers, bonus loyalty points)

Within each category, use the `::grid` and `::perk` Comark containers for a responsive two-column card layout:

```markdown
::grid ::perk{brandName="Brand A" badge="FREE" logoUrl="https://..."} Short concise summary of the perk, validity window, and exact redemption step. ::

::perk{brandName="Brand B" badge="VOUCHER" logoUrl="https://..."} Short concise summary of the perk, validity window, and exact redemption step. :: ::
```

### E. Frequently Asked Questions (PAA)

- Address 4–6 high-frequency questions discovered via Treg search.
- Focus on general questions:
  - _"Can I claim birthday freebies on the spot without registering beforehand?"_
  - _"Which brands give 100% free food with no purchase required?"_
  - _"Do I have to redeem perks on my exact birthday or throughout the month?"_
- Provide a direct, standalone 40–60 word answer for each.
