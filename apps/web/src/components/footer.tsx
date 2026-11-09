import { Badge } from "@befday-2.0/ui/components/badge";
import { Instagram, Threads, TikTok } from "@befday-2.0/ui/socials";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const Footer = () => (
  <footer>
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="flex max-w-xs flex-col items-start">
          <Link
            className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight lowercase"
            href="/"
          >
            <svg
              aria-hidden="true"
              className="size-5.5 shrink-0"
              fill="none"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-brand"
                d="M256 44 C243 66 234 84 234 99 C234 112 244 122 256 122 C268 122 278 112 278 99 C278 84 269 66 256 44 Z"
              />
              <path
                className="fill-brand"
                d="M180 62 C168 82 160 98 160 111 C160 123 169 132 180 132 C191 132 200 123 200 111 C200 98 192 82 180 62 Z"
              />
              <path
                className="fill-brand"
                d="M332 62 C320 82 312 98 312 111 C312 123 321 132 332 132 C343 132 352 123 352 111 C352 98 344 82 332 62 Z"
              />
              <rect
                fill="currentColor"
                height="56"
                rx="12"
                width="24"
                x="244"
                y="134"
              />
              <rect
                fill="currentColor"
                height="46"
                rx="12"
                width="24"
                x="168"
                y="144"
              />
              <rect
                fill="currentColor"
                height="46"
                rx="12"
                width="24"
                x="320"
                y="144"
              />
              <path
                d="M128 232 A28 28 0 0 1 156 204 H356 A28 28 0 0 1 384 232 V262 A32 32 0 0 1 320 262 A32 32 0 0 1 256 262 A32 32 0 0 1 192 262 A32 32 0 0 1 128 262 Z"
                fill="currentColor"
              />
              <rect
                fill="currentColor"
                height="96"
                rx="28"
                width="320"
                x="96"
                y="314"
              />
              <rect
                fill="currentColor"
                height="34"
                rx="17"
                width="384"
                x="64"
                y="428"
              />
            </svg>
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

export default Footer;
