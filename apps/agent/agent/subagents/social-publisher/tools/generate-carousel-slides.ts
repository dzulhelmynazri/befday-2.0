import { Resvg } from "@resvg/resvg-js";
import { defineTool } from "eve/tools";
import slugify from "slugify";
import { z } from "zod";

import { uploadSocialSlide } from "@/lib/storage";

type BrandThemeName = "paper" | "terracotta" | "charcoal";

type SlideAspectRatio = "4:5" | "9:16" | "4:3";

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

interface SlideLayout {
  brandStartY: number;
  cardHeight: number;
  cardWidth: number;
  cardX: number;
  cardY: number;
  coverHeadlineY: number;
  coverMaxChars: number;
  footerLineY: number;
  height: number;
  notesFontSize: number;
  notesRowGap: number;
  notesStartY: number;
  notesTitleY: number;
  topBadgeY: number;
  width: number;
}

const LAYOUTS: Record<SlideAspectRatio, SlideLayout> = {
  // Google Business Profile native landscape (1200x900)
  "4:3": {
    brandStartY: 420,
    cardHeight: 820,
    cardWidth: 1120,
    cardX: 40,
    cardY: 40,
    coverHeadlineY: 340,
    coverMaxChars: 24,
    footerLineY: 720,
    height: 900,
    notesFontSize: 28,
    notesRowGap: 44,
    notesStartY: 230,
    notesTitleY: 160,
    topBadgeY: 110,
    width: 1200,
  },
  // Instagram, Threads, Facebook Page, LinkedIn native portrait (1080x1350)
  "4:5": {
    brandStartY: 580,
    cardHeight: 1254,
    cardWidth: 984,
    cardX: 48,
    cardY: 48,
    coverHeadlineY: 490,
    coverMaxChars: 18,
    footerLineY: 1060,
    height: 1350,
    notesFontSize: 34,
    notesRowGap: 62,
    notesStartY: 340,
    notesTitleY: 245,
    topBadgeY: 230,
    width: 1080,
  },
  // TikTok Photo Mode & Pinterest native full-screen vertical (1080x1920)
  "9:16": {
    brandStartY: 820,
    cardHeight: 1560,
    cardWidth: 984,
    cardX: 48,
    cardY: 180,
    coverHeadlineY: 690,
    coverMaxChars: 18,
    footerLineY: 1490,
    height: 1920,
    notesFontSize: 34,
    notesRowGap: 72,
    notesStartY: 470,
    notesTitleY: 350,
    topBadgeY: 300,
    width: 1080,
  },
};

// Exact tokens from packages/ui/src/styles/globals.css & packages/ui/src/components/button.tsx
const PALETTES: Record<BrandThemeName, BrandPalette> = {
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

const renderSvgToPng = (svg: string, width: number): Uint8Array => {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });

  return resvg.render().asPng();
};

const buildBrandFooterSvg = (
  palette: BrandPalette,
  layout: SlideLayout,
  leftLabel: string
): string => {
  const padX = layout.cardX + 56;
  const rightX = layout.width - padX;
  const buttonY = layout.footerLineY + 24;
  const textY = layout.footerLineY + 62;

  return `<line x1="${padX}" y1="${layout.footerLineY}" x2="${rightX}" y2="${layout.footerLineY}" stroke="${palette.border}" stroke-width="2" />
    <text x="${padX}" y="${textY}" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="500">${escapeXml(
      leftLabel
    )}</text>
    <rect x="${rightX - 220}" y="${buttonY}" width="220" height="58" rx="14" fill="${palette.buttonBg}" />
    <text x="${rightX - 110}" y="${textY}" text-anchor="middle" fill="${palette.buttonText}" font-family="system-ui, -apple-system, sans-serif" font-size="25" font-weight="700" letter-spacing="-0.3">befday.com</text>`;
};

const buildCoverSlideSvg = (input: {
  headline: string;
  layout: SlideLayout;
  palette: BrandPalette;
  subheadline: string;
  tag: string;
  totalSlides: number;
}): string => {
  const { layout, palette } = input;
  const padX = layout.cardX + 56;
  const rightX = layout.width - padX;

  const headlineLines = wrapText(input.headline, layout.coverMaxChars).slice(
    0,
    3
  );

  const subLines = wrapText(input.subheadline, 36).slice(0, 2);

  const headlineSvg = headlineLines
    .map(
      (line, index) =>
        `<text x="${padX}" y="${layout.coverHeadlineY + index * 86}" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="74" font-weight="800" letter-spacing="-2">${escapeXml(
          line
        )}</text>`
    )
    .join("");

  const subStartY = layout.coverHeadlineY + 40 + headlineLines.length * 86;

  const subSvg = subLines
    .map(
      (line, index) =>
        `<text x="${padX}" y="${subStartY + index * 46}" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="500">${escapeXml(
          line
        )}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">
    <rect width="${layout.width}" height="${layout.height}" fill="${palette.canvasBg}" />
    <rect x="${layout.cardX}" y="${layout.cardY}" width="${layout.cardWidth}" height="${layout.cardHeight}" rx="40" fill="${palette.cardBg}" stroke="${palette.border}" stroke-width="2" />
    <rect x="${padX}" y="${layout.topBadgeY}" width="310" height="54" rx="27" fill="${palette.badgeBg}" stroke="${palette.badgeBorder}" stroke-width="1.5" />
    <text x="${padX + 155}" y="${layout.topBadgeY + 35}" text-anchor="middle" fill="${palette.badgeText}" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="700" letter-spacing="2">${escapeXml(
      input.tag.toUpperCase()
    )}</text>
    <text x="${rightX}" y="${layout.topBadgeY + 35}" text-anchor="end" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600">1 / ${input.totalSlides}</text>
    ${headlineSvg}
    ${subSvg}
    ${buildBrandFooterSvg(palette, layout, "Swipe for birthday perks")}
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
  palette: BrandPalette,
  layout: SlideLayout
): string => {
  const padX = layout.cardX + 56;
  const rightX = layout.width - padX;
  const lineText = `${item.brandName} - ${item.reward}`;
  const textLines = wrapText(lineText, 24).slice(0, 4);

  const textSvg = textLines
    .map(
      (line, index) =>
        `<text x="${padX}" y="${layout.brandStartY + index * 82}" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.5">${escapeXml(
          line
        )}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">
    <rect width="${layout.width}" height="${layout.height}" fill="${palette.canvasBg}" />
    <rect x="${layout.cardX}" y="${layout.cardY}" width="${layout.cardWidth}" height="${layout.cardHeight}" rx="40" fill="${palette.cardBg}" stroke="${palette.border}" stroke-width="2" />
    <text x="${rightX}" y="${layout.topBadgeY + 35}" text-anchor="end" fill="${palette.muted}" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600">${slideNumber} / ${totalSlides}</text>
    ${textSvg}
    ${buildBrandFooterSvg(palette, layout, "Full claim steps at befday.com")}
  </svg>`;
};

const buildNotesCheatSheetSvg = (input: {
  items: BrandSlideItem[];
  layout: SlideLayout;
  palette: BrandPalette;
  title: string;
}): string => {
  const { layout, palette } = input;
  const padX = layout.cardX + 56;

  const rows = input.items
    .slice(0, 11)
    .map((item, index) => {
      const y = layout.notesStartY + index * layout.notesRowGap;

      return `<text x="${padX}" y="${y}" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="${layout.notesFontSize}" font-weight="500">${escapeXml(
        `${item.brandName} - ${item.reward}`
      )}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">
    <rect width="${layout.width}" height="${layout.height}" fill="${palette.canvasBg}" />
    <rect x="${layout.cardX}" y="${layout.cardY}" width="${layout.cardWidth}" height="${layout.cardHeight}" rx="40" fill="${palette.cardBg}" stroke="${palette.border}" stroke-width="2" />
    <text x="${padX}" y="${layout.notesTitleY}" fill="${palette.foreground}" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.2">${escapeXml(
      input.title
    )}</text>
    ${rows}
    ${buildBrandFooterSvg(palette, layout, "Birthday perks & free treats")}
  </svg>`;
};

export default defineTool({
  description:
    "Generates branded PNG carousel slides using befday.com's editorial palette ('paper', 'terracotta', 'charcoal') and platform-native aspect ratios ('4:5' 1080x1350 for Instagram/Threads/Facebook/LinkedIn, '9:16' 1080x1920 for TikTok/Pinterest, '4:3' 1200x900 for Google Business).",
  execute: async (input) => {
    const campaignSlug = slugify(input.campaignTitle, {
      lower: true,
      strict: true,
      trim: true,
    });

    const timestamp = Date.now();
    const layout = LAYOUTS[input.aspectRatio];
    const coverPalette = PALETTES[input.theme];

    const interiorPalette =
      input.theme === "terracotta" ? PALETTES.paper : coverPalette;

    const slideSvgs: string[] = [];

    if (input.template === "notes_cheat_sheet") {
      slideSvgs.push(
        buildNotesCheatSheetSvg({
          items: input.items,
          layout,
          palette: coverPalette,
          title: input.campaignTitle,
        })
      );
    } else {
      const totalSlides = input.items.length + 1;
      slideSvgs.push(
        buildCoverSlideSvg({
          headline: input.campaignTitle,
          layout,
          palette: coverPalette,
          subheadline: input.subheadline,
          tag: input.tag,
          totalSlides,
        })
      );

      for (const [index, item] of input.items.entries()) {
        slideSvgs.push(
          buildBrandSlideSvg(
            item,
            index + 2,
            totalSlides,
            interiorPalette,
            layout
          )
        );
      }
    }

    const mediaUrls = await Promise.all(
      slideSvgs.map((svg, index) => {
        const pngBuffer = renderSvgToPng(svg, layout.width);
        const key = `social/carousels/${campaignSlug}-${input.aspectRatio.replace(":", "x")}-${timestamp}/slide-${index + 1}.png`;

        return uploadSocialSlide(key, pngBuffer);
      })
    );

    return {
      aspectRatio: input.aspectRatio,
      dimensions: `${layout.width}x${layout.height}`,
      mediaUrls,
      slideCount: mediaUrls.length,
      template: input.template,
      theme: input.theme,
    };
  },
  inputSchema: z.object({
    aspectRatio: z
      .enum(["4:5", "9:16", "4:3"])
      .default("4:5")
      .describe(
        "Platform-native aspect ratio: '4:5' (1080x1350 for Instagram, Threads, Facebook Page, LinkedIn), '9:16' (1080x1920 for TikTok Photo Mode & Pinterest), or '4:3' (1200x900 landscape for Google Business Profile)"
      ),
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
