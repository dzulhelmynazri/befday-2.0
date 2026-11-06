/* oxlint-disable shadcn/no-inline-styles */
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const GET = (request: NextRequest) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "befday";

  return new ImageResponse(
    <div
      style={{
        backgroundColor: "#09090b",
        color: "#fafafa",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "64px 80px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: "12px" }}>
        <div
          style={{
            backgroundColor: "#f59e0b",
            borderRadius: "50%",
            height: "16px",
            width: "16px",
          }}
        />
        <div
          style={{
            color: "#fafafa",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          befday
        </div>
      </div>

      <div
        style={{
          color: "#ffffff",
          display: "flex",
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: "1px solid #27272a",
          color: "#a1a1aa",
          display: "flex",
          fontSize: 22,
          justifyContent: "space-between",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex" }}>
          Birthday perks, free treats & secret guides
        </div>
        <div style={{ color: "#f59e0b", display: "flex", fontWeight: 600 }}>
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
