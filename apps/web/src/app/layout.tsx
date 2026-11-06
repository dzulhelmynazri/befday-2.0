import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
// import Header from "@/components/header";
import Providers from "@/components/providers";
import { baseUrl } from "@/utils/base-url";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  alternates: {
    canonical: "./",
  },
  description:
    "Curated birthday perks, free treats, secret vouchers, and step-by-step redemption tips.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    description:
      "Curated birthday perks, free treats, secret vouchers, and step-by-step redemption tips.",
    locale: "en_US",
    siteName: "befday",
    title: "befday — Never Miss a Birthday Perk",
    type: "website",
    url: baseUrl,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: "befday — Never Miss a Birthday Perk",
    template: "%s | befday",
  },
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@id": `${baseUrl}/#website`,
              "@type": "WebSite",
              description:
                "Curated birthday perks, free treats, secret vouchers, and step-by-step redemption tips.",
              name: "befday",
              url: baseUrl,
            },
            {
              "@id": `${baseUrl}/#organization`,
              "@type": "Organization",
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/og?title=befday`,
              },
              name: "befday",
              url: baseUrl,
            },
          ],
        })}
      </script>
      <Providers>
        <div className="grid h-svh grid-rows-[auto_1fr]">
          {/* <Header /> */}
          {children}
        </div>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
