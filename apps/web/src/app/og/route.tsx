/* oxlint-disable shadcn/no-inline-styles */
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Design tokens matching packages/ui/src/styles/globals.css (:root light mode)
const THEME = {
  // --background: oklch(0.9818 0.0054 95.0986)
  background: "#faf9f5",
  // --border: oklch(0.8847 0.0069 97.3627)
  border: "#dad9d4",
  // --brand: oklch(0.6171 0.1375 39.0427)
  brand: "#c96442",
  // --primary: oklch(0.2 0.005 60)
  foreground: "#181614",
  // --muted-foreground: oklch(0.6059 0.0075 97.4233)
  muted: "#83827d",
} as const;

export const GET = (request: NextRequest) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "befday";

  return new ImageResponse(
    <div
      style={{
        backgroundColor: THEME.background,
        color: THEME.foreground,
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "64px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: THEME.foreground,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          fontSize: 56,
          fontWeight: 800,
          justifyContent: "center",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: `1px solid ${THEME.border}`,
          color: THEME.muted,
          display: "flex",
          fontSize: 22,
          justifyContent: "space-between",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex" }}>
          Birthday perks, free treats & secret guides
        </div>
        <div style={{ color: THEME.brand, display: "flex", fontWeight: 600 }}>
          befday.com
        </div>
      </div>
    </div>,
    {
      height: 630,
      width: 1200,
    }
  );
};
