"use client";

import { Badge } from "@befday-2.0/ui/components/badge";
import { Instagram, Threads, TikTok } from "@befday-2.0/ui/socials";
import Link from "next/link";
import { usePathname } from "next/navigation";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/onboarding")) {
    return null;
  }

  return (
    <footer>
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex max-w-xs flex-col items-start">
            <Link
              className="text-foreground text-lg font-bold tracking-tight lowercase"
              href="/"
            >
              befday
            </Link>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed lowercase">
              discover curated birthday perks, free treats, secret vouchers, and
              step-by-step redemption guides in malaysia.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-foreground text-sm font-medium lowercase">
                social media
              </h3>
              <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    className="hover:text-foreground flex items-center gap-2 transition-colors lowercase"
                    href="https://www.instagram.com/befday_com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Instagram className="size-4 shrink-0" />
                    instagram
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-foreground flex items-center gap-2 transition-colors lowercase"
                    href="https://www.threads.net/@befday_com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Threads className="size-4 shrink-0" />
                    threads
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-foreground flex items-center gap-2 transition-colors lowercase"
                    href="https://www.tiktok.com/@befday_com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <TikTok className="size-4 shrink-0" />
                    tiktok
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-sm font-medium lowercase">
                legal
              </h3>
              <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    className="hover:text-foreground transition-colors lowercase"
                    href="/privacy-policy"
                  >
                    privacy policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-foreground transition-colors lowercase"
                    href="/terms-of-service"
                  >
                    terms of service
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-foreground transition-colors lowercase"
                    href="/blog"
                  >
                    blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-sm font-medium lowercase">
                be our partner
              </h3>
              <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    className="hover:text-foreground transition-colors lowercase"
                    href="/partner"
                  >
                    submit perk
                  </Link>
                </li>
                <li>
                  <Badge variant="secondary">100% free</Badge>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-border/60 mt-12 border-t pt-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <p
            className="text-muted-foreground text-xs lowercase"
            suppressHydrationWarning
          >
            © {currentYear} befday.com. all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
