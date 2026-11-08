import { Resvg } from "@resvg/resvg-js";
import { defineTool } from "eve/tools";
import slugify from "slugify";
import { z } from "zod";

import { uploadSocialSlide } from "@/lib/storage";

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350;

type BrandThemeName = "paper" | "terracotta" | "charcoal";

interface BrandPalette {
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  canvasBg: string;
  cardBg: string;
  foreground: string;
  muted: string;
}

// Exact tokens from packages/ui/src/styles/globals.css & packages/ui/src/components/button.tsx
const PALETTES: Record<BrandThemeName, BrandPalette> = {
  // .dark tokens (--background: #262624, --primary: #fafafa, --primary-foreground: #181614)
  charcoal: {
    badgeBg: "#30302e",
    badgeBorder: "#454540",
    badgeText: "#faf9f5",
    border: "#454540",
    buttonBg: "#fafafa",
    buttonText: "#181614",
    canvasBg: "#1c1c1a",
    cardBg: "#262624",
    foreground: "#faf9f5",
    muted: "#b6b4ac",
  },
  // :root light tokens (--background: #faf9f5, --primary: #181614, --primary-foreground: #ffffff, --secondary: #e8e5dc)
  paper: {
    badgeBg: "#e8e5dc",
    badgeBorder: "#dad9d4",
    badgeText: "#53514b",
    border: "#dad9d4",
    buttonBg: "#181614",
    buttonText: "#ffffff",
    canvasBg: "#f2efe6",
    cardBg: "#faf9f5",
    foreground: "#181614",
    muted: "#83827d",
  },
  // --brand tokens (--brand: #c96442, --primary: #181614, --primary-foreground: #ffffff)
  terracotta: {
    badgeBg: "#b55332",
    badgeBorder: "#df8363",
    badgeText: "#ffffff",
    border: "#df8363",
    buttonBg: "#181614",
    buttonText: "#ffffff",
    canvasBg: "#b55332",
    cardBg: "#c96442",
    foreground: "#ffffff",
    muted: "#f7dcd2",
  },
};

const escapeXml = (text: string): string =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.trim().split(/\s+/u);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
      }

      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

const renderSvgToPng = (svg: string): Uint8Array => {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: SLIDE_WIDTH,
    },
  });

  return resvg.render().asPng();
};

const buildBrandFooterSvg = (
  palette: BrandPalette,
  leftLabel: string
): string => `<line x1="104" y1="1060" x2="${SLIDE_WIDTH - 104}" y2="1060" stroke="${palette.border}" stroke-width="2" />
    <text x="104" y="1124" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="500">${escapeXml(
      leftLabel
    )}</text>
    <rect x="${SLIDE_WIDTH - 324}" y="1084" width="220" height="58" rx="14" fill="${palette.buttonBg}" />
    <text x="${SLIDE_WIDTH - 214}" y="1122" text-anchor="middle" fill="${palette.buttonText}" font-family="system-ui, -apple-system, sans-serif" font-size="25" font-weight="700" letter-spacing="-0.3">befday.com</text>`;

const buildCoverSlideSvg = (input: {
  headline: string;
  palette: BrandPalette;
  subheadline: string;
  tag: string;
  totalSlides: number;
}): string => {
  const { palette } = input;
  const headlineLines = wrapText(input.headline, 18).slice(0, 4);
  const subLines = wrapText(input.subheadline, 34).slice(0, 2);

  const headlineSvg = headlineLines
    .map(
      (line, index) =>
        `<text x="104" y="${490 + index * 88}" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="800" letter-spacing="-2">${escapeXml(
          line
        )}</text>`
    )
    .join("");

  const subStartY = 530 + headlineLines.length * 88;

  const subSvg = subLines
    .map(
      (line, index) =>
        `<text x="104" y="${subStartY + index * 46}" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="500">${escapeXml(
          line
        )}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SLIDE_WIDTH}" height="${SLIDE_HEIGHT}" viewBox="0 0 ${SLIDE_WIDTH} ${SLIDE_HEIGHT}">
    <rect width="${SLIDE_WIDTH}" height="${SLIDE_HEIGHT}" fill="${palette.canvasBg}" />
    <rect x="48" y="48" width="${SLIDE_WIDTH - 96}" height="${SLIDE_HEIGHT - 96}" rx="40" fill="${palette.cardBg}" stroke="${palette.border}" stroke-width="2" />
    <rect x="104" y="230" width="310" height="54" rx="27" fill="${palette.badgeBg}" stroke="${palette.badgeBorder}" stroke-width="1.5" />
    <text x="259" y="265" text-anchor="middle" fill="${palette.badgeText}" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="700" letter-spacing="2">${escapeXml(
      input.tag.toUpperCase()
    )}</text>
    <text x="${SLIDE_WIDTH - 104}" y="265" text-anchor="end" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600">1 / ${input.totalSlides}</text>
    ${headlineSvg}
    ${subSvg}
    ${buildBrandFooterSvg(palette, "Swipe for birthday perks ->")}
  </svg>`;
};

interface BrandSlideItem {
  brandName: string;
  reward: string;
}

const buildBrandSlideSvg = (
  item: BrandSlideItem,
  slideNumber: number,
  totalSlides: number,
  palette: BrandPalette
): string => {
  const lineText = `${item.brandName} - ${item.reward}`;
  const textLines = wrapText(lineText, 24).slice(0, 4);

  const textSvg = textLines
    .map(
      (line, index) =>
        `<text x="104" y="${580 + index * 82}" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.5">${escapeXml(
          line
        )}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SLIDE_WIDTH}" height="${SLIDE_HEIGHT}" viewBox="0 0 ${SLIDE_WIDTH} ${SLIDE_HEIGHT}">
    <rect width="${SLIDE_WIDTH}" height="${SLIDE_HEIGHT}" fill="${palette.canvasBg}" />
    <rect x="48" y="48" width="${SLIDE_WIDTH - 96}" height="${SLIDE_HEIGHT - 96}" rx="40" fill="${palette.cardBg}" stroke="${palette.border}" stroke-width="2" />
    <text x="${SLIDE_WIDTH - 104}" y="265" text-anchor="end" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600">${slideNumber} / ${totalSlides}</text>
    ${textSvg}
    ${buildBrandFooterSvg(palette, "Full claim steps at befday.com")}
  </svg>`;
};

const buildNotesCheatSheetSvg = (input: {
  items: BrandSlideItem[];
  palette: BrandPalette;
  title: string;
}): string => {
  const { palette } = input;

  const rows = input.items
    .slice(0, 11)
    .map(
      (item, index) =>
        `<text x="104" y="${340 + index * 62}" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="500">${escapeXml(
          `${item.brandName} - ${item.reward}`
        )}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SLIDE_WIDTH}" height="${SLIDE_HEIGHT}" viewBox="0 0 ${SLIDE_WIDTH} ${SLIDE_HEIGHT}">
    <rect width="${SLIDE_WIDTH}" height="${SLIDE_HEIGHT}" fill="${palette.canvasBg}" />
    <rect x="48" y="48" width="${SLIDE_WIDTH - 96}" height="${SLIDE_HEIGHT - 96}" rx="40" fill="${palette.cardBg}" stroke="${palette.border}" stroke-width="2" />
    <text x="104" y="245" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.2">${escapeXml(
      input.title
    )}</text>
    ${rows}
    ${buildBrandFooterSvg(palette, "Birthday perks & free treats")}
  </svg>`;
};

export default defineTool({
  description:
    "Generates branded 1080x1350 (4:5 portrait) PNG carousel slides using befday.com's editorial palette ('paper', 'terracotta', 'charcoal') and 3-column grid safe zones for Instagram Carousels and TikTok Photo Mode.",
  execute: async (input) => {
    const campaignSlug = slugify(input.campaignTitle, {
      lower: true,
      strict: true,
      trim: true,
    });

    const timestamp = Date.now();
    const coverPalette = PALETTES[input.theme];

    const interiorPalette =
      input.theme === "terracotta" ? PALETTES.paper : coverPalette;

    const slideSvgs: string[] = [];

    if (input.template === "notes_cheat_sheet") {
      slideSvgs.push(
        buildNotesCheatSheetSvg({
          items: input.items,
          palette: coverPalette,
          title: input.campaignTitle,
        })
      );
    } else {
      const totalSlides = input.items.length + 1;
      slideSvgs.push(
        buildCoverSlideSvg({
          headline: input.campaignTitle,
          palette: coverPalette,
          subheadline: input.subheadline,
          tag: input.tag,
          totalSlides,
        })
      );

      for (const [index, item] of input.items.entries()) {
        slideSvgs.push(
          buildBrandSlideSvg(item, index + 2, totalSlides, interiorPalette)
        );
      }
    }

    const mediaUrls = await Promise.all(
      slideSvgs.map((svg, index) => {
        const pngBuffer = renderSvgToPng(svg);
        const key = `social/carousels/${campaignSlug}-${timestamp}/slide-${index + 1}.png`;

        return uploadSocialSlide(key, pngBuffer);
      })
    );

    return {
      mediaUrls,
      slideCount: mediaUrls.length,
      template: input.template,
      theme: input.theme,
    };
  },
  inputSchema: z.object({
    campaignTitle: z
      .string()
      .min(1)
      .describe(
        "Main headline for the cover slide or Notes card (e.g. 'November Birthday Treats')"
      ),
    items: z
      .array(
        z.object({
          brandName: z
            .string()
            .min(1)
            .describe("Brand name (e.g. 'Zus Coffee')"),
          reward: z
            .string()
            .min(1)
            .describe(
              "Short 2-4 word reward (e.g. 'Free cake', 'Free Sofuto')"
            ),
        })
      )
      .min(1)
      .max(11)
      .describe(
        "Minimalist brand reward pairs (e.g. 'Zus Coffee - Free cake') without full claim instructions"
      ),
    subheadline: z
      .string()
      .default("Birthday perks, free treats & secret guides")
      .describe("Subtitle on the cover slide"),
    tag: z
      .string()
      .default("BIRTHDAY PERKS")
      .describe("Top pill badge text on the cover slide"),
    template: z
      .enum(["brand_carousel", "notes_cheat_sheet"])
      .default("brand_carousel")
      .describe(
        "Visual style: 'brand_carousel' (multi-slide cover + minimalist 'Brand - Reward' slides) or 'notes_cheat_sheet' (single-card cheat-sheet list)"
      ),
    theme: z
      .enum(["paper", "terracotta", "charcoal"])
      .default("paper")
      .describe(
        "befday.com 3-column grid color theme: 'paper' (#faf9f5 warm cream), 'terracotta' (#c96442 brand orange cover), or 'charcoal' (#262624 warm dark)"
      ),
  }),
});
