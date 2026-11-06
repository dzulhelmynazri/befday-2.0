import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@befday-2.0/ui/components/avatar";
import { Badge } from "@befday-2.0/ui/components/badge";
import { buttonVariants } from "@befday-2.0/ui/components/button";
import { Skeleton } from "@befday-2.0/ui/components/skeleton";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

import { baseUrl } from "@/utils/base-url";
import { formatShortDate } from "@/utils/date";
import { getServerApi } from "@/utils/trpc-server";

const getBrand = cache(async (slug: string) => {
  const api = await getServerApi();

  return api.perk.bySlug({ slug });
});

export const generateMetadata = async ({
  params,
}: PageProps<"/perks/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand || brand.perks.length === 0) {
    return {
      title: "Perk Not Found",
    };
  }

  const title = `${brand.name} Birthday Perk & Freebies — !`;
  const { description } = brand;
  const perkUrl = `${baseUrl}/perks/${brand.slug}`;
  const ogImage = brand.logoUrl;

  return {
    alternates: {
      canonical: perkUrl,
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: brand.name,
          url: ogImage,
        },
      ],
      title,
      type: "website",
      url: perkUrl,
    },
    title,
    twitter: {
      card: "summary",
      description,
      images: [ogImage],
      title,
    },
  };
};

export const PerkDetailSkeleton = () => (
  <main className="container mx-auto max-w-xl px-4 py-16 sm:py-20">
    <div className="mb-8">
      <Skeleton className="h-4 w-24" />
    </div>

    <div className="space-y-6">
      <Skeleton className="size-10" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-8 w-28" />

      <div className="space-y-8 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    </div>
  </main>
);

const PerkDetailContent = async ({
  params,
}: {
  params: PageProps<"/perks/[slug]">["params"];
}) => {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) {
    notFound();
  }

  const [primaryPerk] = brand.perks;

  if (!primaryPerk) {
    notFound();
  }

  const perkUrl = `${baseUrl}/perks/${brand.slug}`;

  return (
    <main className="container mx-auto max-w-xl px-4 py-16 sm:py-20">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  item: baseUrl,
                  name: "home",
                  position: 1,
                },
                {
                  "@type": "ListItem",
                  item: perkUrl,
                  name: brand.name.toLowerCase(),
                  position: 2,
                },
              ],
            },
            {
              "@type": "Offer",
              description: brand.description,
              name: `${brand.name} birthday perk`,
              price: primaryPerk.badge === "FREE" ? "0" : undefined,
              priceCurrency: "MYR",
              seller: {
                "@type": "Organization",
                name: brand.name,
                url: brand.websiteUrl,
              },
              url: perkUrl,
              validFrom: primaryPerk.verifiedAt.toISOString(),
            },
          ],
        })}
      </script>

      {/* Navigation Breadcrumb / Back button */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          className={buttonVariants({ size: "sm", variant: "link" })}
          href="/"
        >
          back to perks
        </Link>
      </nav>

      <article className="space-y-6">
        {/* Brand Icon / Logo */}
        <Avatar size="lg">
          <AvatarImage alt={brand.name} src={brand.logoUrl} />
          <AvatarFallback>{brand.name.charAt(0).toLowerCase()}</AvatarFallback>
        </Avatar>

        {/* Brand Title & Badge */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {brand.name.toLowerCase()}
            </h1>
            <Badge variant="outline">
              {primaryPerk.badge === "FREE" ? "free" : "voucher"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            {brand.description.toLowerCase()}
          </p>
        </div>

        {/* Action Links (Location, Website, App Store, Play Store) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {brand.googleMapUrl && (
            <a
              className={buttonVariants({
                size: "default",
                variant: "link",
              })}
              href={brand.googleMapUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              location
              <ArrowUpRight data-icon="inline-end" />
            </a>
          )}
          {brand.websiteUrl && brand.websiteUrl !== brand.googleMapUrl && (
            <a
              className={buttonVariants({
                size: "default",
                variant: "link",
              })}
              href={brand.websiteUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              website
              <ArrowUpRight data-icon="inline-end" />
            </a>
          )}
          {brand.appStoreUrl && (
            <a
              className={buttonVariants({
                size: "default",
                variant: "link",
              })}
              href={brand.appStoreUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              app store
              <ArrowUpRight data-icon="inline-end" />
            </a>
          )}
          {brand.playStoreUrl && (
            <a
              className={buttonVariants({
                size: "default",
                variant: "link",
              })}
              href={brand.playStoreUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              play store
              <ArrowUpRight data-icon="inline-end" />
            </a>
          )}
        </div>

        {/* Detail Sections */}
        <div className="space-y-8 pt-6">
          {/* Section: Birthday Perks */}
          <section
            aria-labelledby="birthday-perks-heading"
            className="space-y-2"
          >
            <h2
              className="text-foreground text-base font-semibold"
              id="birthday-perks-heading"
            >
              birthday perks
            </h2>
            {primaryPerk.perksList.length > 0 ? (
              <ul className="text-foreground space-y-1.5 text-sm">
                {primaryPerk.perksList.map((perkItem, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    <span className="text-muted-foreground select-none">•</span>
                    <span>{perkItem.toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                {primaryPerk.headline.toLowerCase()}
              </p>
            )}
          </section>

          {/* Section: Validity */}
          <section aria-labelledby="validity-heading" className="space-y-2">
            <h2
              className="text-foreground text-base font-semibold"
              id="validity-heading"
            >
              validity
            </h2>
            <p className="text-muted-foreground text-sm">
              {primaryPerk.validity.toLowerCase()}
            </p>
          </section>

          {/* Section: How To Redeem */}
          <section aria-labelledby="redeem-heading" className="space-y-2">
            <h2
              className="text-foreground text-base font-semibold"
              id="redeem-heading"
            >
              how to redeem
            </h2>
            {primaryPerk.howToRedeem.length > 0 ? (
              <ul className="text-foreground space-y-1.5 text-sm">
                {primaryPerk.howToRedeem.map((step, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    <span className="text-muted-foreground select-none">•</span>
                    <span>{step.toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                not specified
              </p>
            )}
          </section>
        </div>
      </article>

      {/* Floating Verified Badge at Bottom Right */}
      <aside
        aria-label="Verification status"
        className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
      >
        <div className="bg-background/80 text-muted-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs shadow-xs backdrop-blur-md select-none tabular-nums">
          <BadgeCheck className="text-primary size-3.5 shrink-0" />
          verified {formatShortDate(primaryPerk.verifiedAt).toLowerCase()}
        </div>
      </aside>
    </main>
  );
};

const PerkDetailPage = ({ params }: PageProps<"/perks/[slug]">) => (
  <Suspense fallback={<PerkDetailSkeleton />}>
    <PerkDetailContent params={params} />
  </Suspense>
);

export default PerkDetailPage;
