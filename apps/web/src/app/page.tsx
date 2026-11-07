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
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@befday-2.0/ui/components/item";
import { Skeleton } from "@befday-2.0/ui/components/skeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { getServerApi } from "@/utils/trpc-server";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "happy befday! discover curated shops, cafes, and entertainment spots that offer verified birthday perks, free treats, and exclusive vouchers.",
  title: {
    absolute: "happy befday! — free birthday perks, treats & guides",
  },
};

export const ShopsGridSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {[
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30,
    ].map((i) => (
      <Item key={i} variant="outline">
        <ItemHeader>
          <ItemMedia>
            <Skeleton className="size-6" />
          </ItemMedia>
          <Skeleton className="h-4 w-10" />
        </ItemHeader>
        <ItemContent>
          <Skeleton className="h-3.5 w-24" />
        </ItemContent>
      </Item>
    ))}
  </div>
);

const HomeContent = async () => {
  const api = await getServerApi();
  const perks = await api.perk.all();

  return (
    <section aria-labelledby="shops-heading">
      <h2 className="sr-only" id="shops-heading">
        featured birthday perks
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {perks.map((perk) => (
          <Item
            className="cursor-pointer"
            key={perk.id}
            render={<Link href={`/perks/${perk.brand.slug}`} />}
            variant="outline"
          >
            <ItemHeader>
              <ItemMedia>
                <Avatar size="sm">
                  <AvatarImage
                    alt={perk.brand.name}
                    // oxlint-disable-next-line shadcn/no-restyle
                    className="object-contain p-0.5"
                    src={perk.brand.logoUrl}
                  />
                  {/* oxlint-disable-next-line shadcn/no-restyle */}
                  <AvatarFallback className="overflow-hidden p-0">
                    {/* oxlint-disable-next-line next/no-img-element */}
                    <img
                      alt={perk.brand.name}
                      className="size-full object-cover"
                      src={`https://api.dicebear.com/10.x/loops/svg?seed=${encodeURIComponent(perk.brand.name)}`}
                    />
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <Badge variant="outline">{perk.badge.toLowerCase()}</Badge>
            </ItemHeader>
            <ItemContent>
              <ItemTitle>
                <span className="line-clamp-1">
                  {perk.brand.name.toLowerCase()}
                </span>
              </ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </div>
    </section>
  );
};

const homeFaqs = [
  {
    answer:
      "befday is a curated discovery directory sharing verified birthday perks, free meals, drinks, cinema tickets, and exclusive vouchers across malaysia.",
    question: "what is befday?",
  },
  {
    answer:
      "yes, our team regularly reviews and verifies every birthday deal with official brand announcements, membership apps, and in-store redemption terms.",
    question: "are all birthday perks and freebies verified?",
  },
  {
    answer:
      "most popular brands (such as starbucks, boost juice, and familymart) require you to be a registered loyalty member before your birthday month starts. we recommend signing up at least 1 month prior to your birth month.",
    question: "when should i sign up to claim birthday rewards?",
  },
  {
    answer:
      "yes, befday is 100% free to explore with no sign-up or fee required.",
    question: "is befday free to use?",
  },
  {
    answer:
      "brands and cafe owners can submit their birthday perks for free via our partner page. our team reviews and publishes approved listings within 24 to 48 hours.",
    question: "how can brands or stores submit their perks?",
  },
];

const HomePage = () => (
  <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: homeFaqs.map((faq) => ({
          "@type": "Question",
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
          name: faq.question,
        })),
      })}
    </script>

    {/* Hero Header - rendered immediately without skeleton */}
    <div className="mb-12">
      <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-5xl">
        happy befday!
      </h1>
      <p className="text-muted-foreground mt-3 text-base sm:text-lg">
        here are some shops that offer birthday perks
      </p>
    </div>

    <Suspense fallback={<ShopsGridSkeleton />}>
      <HomeContent />
    </Suspense>

    {/* Frequently Asked Questions */}
    <section aria-labelledby="home-faq-heading" className="mt-20 space-y-4">
      <div className="space-y-1">
        <h2
          className="text-foreground text-xl font-bold tracking-tight sm:text-2xl"
          id="home-faq-heading"
        >
          frequently asked questions
        </h2>
        <p className="text-muted-foreground text-sm">
          everything you need to know about claiming birthday perks in malaysia
        </p>
      </div>

      <Accordion>
        {homeFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`home-faq-${index}`}>
            <AccordionTrigger>
              <span className="text-foreground text-sm font-medium">
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <span className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </span>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>

    {/* Floating Feedback / Suggestion Button */}
    <aside
      aria-label="Feedback and suggestions"
      className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
    >
      <a
        className="bg-background/80  border-border  rounded-full border px-3.5 py-2 text-xs font-medium  select-none"
        href="https://wa.link/hqdnzh"
        rel="noopener noreferrer"
        target="_blank"
      >
        suggestion?
      </a>
    </aside>
  </main>
);

export default HomePage;
