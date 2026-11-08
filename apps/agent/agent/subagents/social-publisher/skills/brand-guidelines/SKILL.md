---
name: brand-guidelines
description: Applies befday.com's official brand colors (#faf9f5 warm paper, #c96442 terracotta, #262624 warm charcoal), typography, OG footer signature, and 3-column Instagram/TikTok profile grid cadence.
---

# befday.com Brand & 3-Column Grid Guidelines

Use this skill whenever generating social media carousels, cheat-sheet cards, OG graphics, or branded visual assets for **befday.com**.

---

## 1. Core Brand Palette (`packages/ui/src/styles/globals.css` & `apps/web/src/app/og/route.tsx`)

| Token | Hex | Role |
| --- | --- | --- |
| **Warm Paper (`paper`)** | `#faf9f5` | Primary editorial light card surface (`--background`) |
| **Paper Canvas** | `#f2efe6` | Outer frame background on `paper` slides |
| **Primary Button (Light & Brand)** | `#181614` bg / `#ffffff` text | `packages/ui` `<Button>` (`--primary` / `--primary-foreground`, `rounded-md`) |
| **Primary Button (Dark `charcoal`)** | `#fafafa` bg / `#181614` text | `.dark` `packages/ui` `<Button>` (`--primary` / `--primary-foreground`, `rounded-md`) |
| **Secondary Badge (Light)** | `#e8e5dc` bg / `#53514b` text | `packages/ui` `<Badge variant="secondary">` (`--secondary` / `--secondary-foreground`) |
| **Signature Terracotta (`terracotta`)** | `#c96442` | `--brand` hero cover theme |
| **Warm Charcoal (`charcoal`)** | `#262624` | `.dark` `--background` card surface & Notes cheat sheets |
| **Warm Border** | `#dad9d4` (light) / `#454540` (dark) | Hairline borders and horizontal footer dividers (`--border`) |
| **Warm Muted** | `#83827d` (light) / `#b6b4ac` (dark) | Subtitles, slide counters, and secondary labels (`--muted-foreground`) |

---

## 2. Signature `befday.com` Brand Frame

Every generated slide (`1080x1350`) must include the signature `befday.com` visual anchor so screenshots and reposts are immediately recognizable:

1. **3-Column Thumbnail Safe Zone (`y: 200..1150`)**:
   - Instagram and TikTok crop `1080x1350` covers on the 3-column profile grid.
   - All badges, headlines, and the `befday.com` footer bar sit inside `y: 230..1142` so nothing is ever clipped on the 3-column profile grid.
2. **Signature Footer Bar**:
   - Horizontal divider line across the card.
   - Left prompt: `"Swipe for birthday perks ->"` (cover) or `"Full claim steps at befday.com"` (interior slides).
   - Right anchor: Bold rounded pill with **`befday.com`** in signature terracotta (`#c96442` / `#d97757`).

---

## 3. 3-Column Profile Grid Strategy (Instagram & TikTok)

Instagram and TikTok display profiles in a **3-column grid** (`Column 1 | Column 2 | Column 3`). To make `befday.com` look curated and memorable instead of monotonous, rotate the `theme` parameter in `generate_carousel_slides` across your 3 columns:

| Grid Column | Content Pillar | Theme (`generate_carousel_slides`) | Template |
| --- | --- | --- | --- |
| **Column 1 (Left)** | Category / Niche Guides (e.g. _"7 Free Birthday Coffees"_, _"5 Free Birthday Cakes"_) | `theme: "paper"` (`#faf9f5` warm cream) | `brand_carousel` |
| **Column 2 (Center)** | Monthly Hero Drops (e.g. _"November Birthday Treats in Malaysia"_) | `theme: "terracotta"` (`#c96442` brand orange cover + `paper` interior slides) | `brand_carousel` |
| **Column 3 (Right)** | Viral Cheat-Sheet Lists (e.g. _"November Birthday List"_) | `theme: "charcoal"` (`#262624` warm dark card) | `notes_cheat_sheet` |

Posting in this `paper` → `terracotta` → `charcoal` rhythm creates a cohesive 3-column stripe (or checkerboard when alternated) in `befday.com`'s exact website colors.
