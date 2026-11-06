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
import { Suspense } from "react";

import { getServerApi } from "@/utils/trpc-server";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Happy befday! Discover curated shops, cafes, and entertainment spots that offer verified birthday perks, free treats, and exclusive vouchers.",
  title: {
    absolute: "Happy befday! — Free Birthday Perks, Treats & Guides",
  },
};

export const HomeSkeleton = () => (
  <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
    <div className="mb-10 space-y-3">
      <Skeleton className="h-10 w-64 sm:h-12 sm:w-96" />
      <Skeleton className="h-5 w-80 sm:w-md" />
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Skeleton className="h-24" key={i} />
      ))}
    </div>
  </main>
);

const HomeContent = async () => {
  const api = await getServerApi();
  const perks = await api.perk.all();

  return (
    <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
      {/* Hero Header */}
      <div className="mb-12">
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-5xl">
          Happy befday!
        </h1>
        <p className="text-muted-foreground mt-3 text-base sm:text-lg">
          Here are some shops that offer birthday perks
        </p>
      </div>

      {/* Shops Grid */}
      <section aria-labelledby="shops-heading">
        <h2 className="sr-only" id="shops-heading">
          Featured Birthday Perks
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {perks.map((perk) => (
            <Item key={perk.id} variant="outline">
              <ItemHeader>
                <ItemMedia>
                  <Avatar size="sm">
                    <AvatarImage
                      alt={perk.brand.name}
                      src={perk.brand.logoUrl}
                    />
                    <AvatarFallback>
                      {perk.brand.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <Badge variant="outline">{perk.badge}</Badge>
              </ItemHeader>
              <ItemContent>
                <ItemTitle>{perk.brand.name}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </div>
      </section>
    </main>
  );
};

const HomePage = () => (
  <Suspense fallback={<HomeSkeleton />}>
    <HomeContent />
  </Suspense>
);

export default HomePage;
