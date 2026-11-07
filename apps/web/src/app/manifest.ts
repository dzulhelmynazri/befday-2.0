import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#faf9f5",
    description:
      "Curated birthday perks, free treats, secret vouchers, and step-by-step redemption tips in Malaysia.",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    name: "befday — Never Miss a Birthday Perk",
    short_name: "befday",
    start_url: "/",
    theme_color: "#c96442",
  };
}
