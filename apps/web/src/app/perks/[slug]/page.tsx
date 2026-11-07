import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@befday-2.0/ui/components/accordion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@befday-2.0/ui/components/avatar";
import { Badge } from "@befday-2.0/ui/components/badge";
import { buttonVariants } from "@befday-2.0/ui/components/button";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@befday-2.0/ui/components/item";
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

  const currentYear = new Date().getFullYear();
  const title = `${brand.name} Birthday Perk & Freebies (${currentYear})`;
  const { description } = brand;
  const perkUrl = `${baseUrl}/perks/${brand.slug}`;
  const ogImage = `/og?title=${encodeURIComponent(`${brand.name} Birthday Perk`)}`;

  return {
    alternates: {
      canonical: perkUrl,
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: `${brand.name} Birthday Perk`,
          height: 630,
          url: ogImage,
          width: 1200,
        },
      ],
      title,
      type: "website",
      url: perkUrl,
    },
    title,
    twitter: {
      card: "summary_large_image",
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

  const api = await getServerApi();
  const allPerks = await api.perk.all();

  const relatedPerks = allPerks
    .filter((p) => p.brand.slug !== brand.slug)
    .slice(0, 4);

  const perkUrl = `${baseUrl}/perks/${brand.slug}`;

  const faqs = [
    {
      answer:
        primaryPerk.headline ||
        (primaryPerk.perksList.length > 0
          ? primaryPerk.perksList.join(", ")
          : brand.description),
      question: `What is the ${brand.name} birthday perk?`,
    },
    {
      answer:
        primaryPerk.howToRedeem.length > 0
          ? primaryPerk.howToRedeem.join(" ")
          : `Visit ${brand.name} during your birthday period and present your membership or verification details.`,
      question: `How do I claim the ${brand.name} birthday reward?`,
    },
    {
      answer: primaryPerk.validity,
      question: `How long is the ${brand.name} birthday perk valid?`,
    },
    {
      answer:
        primaryPerk.badge === "FREE"
          ? "This is a 100% free birthday treat with no purchase required."
          : "This is a birthday voucher or discount perk; a minimum spend or qualifying purchase may be required depending on store terms.",
      question: `Is the ${brand.name} birthday perk completely free?`,
    },
  ];

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
            ...(primaryPerk.howToRedeem.length > 0
              ? [
                  {
                    "@type": "HowTo",
                    description: `Step-by-step redemption guide to claim the ${brand.name} birthday treat.`,
                    name: `How to redeem ${brand.name} birthday perk`,
                    step: primaryPerk.howToRedeem.map((instruction, index) => ({
                      "@type": "HowToStep",
                      name: `Step ${index + 1}`,
                      position: index + 1,
                      text: instruction,
                    })),
                  },
                ]
              : []),
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
                name: faq.question,
              })),
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
          <AvatarImage
            alt={brand.name}
            // oxlint-disable-next-line shadcn/no-restyle
            className="object-contain p-0.5"
            src={brand.logoUrl}
          />
          {/* oxlint-disable-next-line shadcn/no-restyle */}
          <AvatarFallback className="overflow-hidden p-0">
            {/* oxlint-disable-next-line next/no-img-element */}
            <img
              alt={brand.name}
              className="size-full object-cover"
              src={`https://api.dicebear.com/10.x/loops/svg?seed=${encodeURIComponent(brand.name)}`}
            />
          </AvatarFallback>
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

          {/* Section: Frequently Asked Questions */}
          <section aria-labelledby="faq-heading" className="space-y-3 pt-20">
            <h2
              className="text-foreground text-base font-semibold"
              id="faq-heading"
            >
              frequently asked questions
            </h2>
            <Accordion>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger>
                    <span className="text-foreground text-sm font-medium">
                      {faq.question.toLowerCase()}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer.toLowerCase()}
                    </span>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Section: More Birthday Perks */}
          {relatedPerks.length > 0 && (
            <section
              aria-labelledby="more-perks-heading"
              className="border-border/60 space-y-4 pt-10"
            >
              <div className="space-y-1">
                <h2
                  className="text-foreground text-base font-semibold"
                  id="more-perks-heading"
                >
                  more birthday perks to explore
                </h2>
                <p className="text-muted-foreground text-xs">
                  discover other verified treats and freebies in malaysia
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {relatedPerks.map((item) => (
                  <Item
                    className="group"
                    key={item.id}
                    render={<Link href={`/perks/${item.brand.slug}`} />}
                    variant="outline"
                  >
                    <ItemHeader>
                      <ItemMedia>
                        <Avatar className="size-6">
                          {item.brand.logoUrl && (
                            <AvatarImage
                              alt={item.brand.name}
                              src={item.brand.logoUrl}
                            />
                          )}
                          <AvatarFallback>
                            {/* oxlint-disable-next-line next/no-img-element */}
                            <img
                              alt={item.brand.name}
                              className="size-full object-cover"
                              src={`https://api.dicebear.com/10.x/loops/svg?seed=${encodeURIComponent(item.brand.name)}`}
                            />
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <Badge variant="outline">
                        {item.badge.toLowerCase()}
                      </Badge>
                    </ItemHeader>
                    <ItemContent>
                      <ItemTitle>
                        <span className="line-clamp-1">
                          {item.brand.name.toLowerCase()}
                        </span>
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* Floating Verified Badge at Bottom Right */}
      <aside
        aria-label="Verification status"
        className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
      >
        <div className="bg-background/80 text-muted-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs shadow-xs backdrop-blur-md select-none tabular-nums">
          {/* oxlint-disable-next-line shadcn/no-raw-colors */}
          <BadgeCheck className="text-purple-600 size-3.5 shrink-0" />
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
