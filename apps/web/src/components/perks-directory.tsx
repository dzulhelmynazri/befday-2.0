"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@befday-2.0/ui/components/avatar";
import { Badge } from "@befday-2.0/ui/components/badge";
import { Button } from "@befday-2.0/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@befday-2.0/ui/components/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@befday-2.0/ui/components/input-group";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@befday-2.0/ui/components/item";
import { Tabs, TabsList, TabsTrigger } from "@befday-2.0/ui/components/tabs";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { createParser, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

export const filterValues = ["all", "free", "voucher"] as const;

export type FilterValue = (typeof filterValues)[number];

export const filterParser = createParser<FilterValue>({
  parse: (value) => {
    const normalized = value.toLowerCase();

    if (normalized === "free" || normalized === "voucher") {
      return normalized;
    }

    return "all";
  },
  serialize: (value) => (value === "all" ? "" : value),
}).withDefault("all");

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: true,
  throttleMs: 300,
});

export interface PerkDirectoryItem {
  id: string;
  badge: "FREE" | "VOUCHER";
  headline: string;
  perksList?: string[];
  brand: {
    logoUrl: string;
    name: string;
    slug: string;
  };
}

interface PerksDirectoryProps {
  perks: PerkDirectoryItem[];
}

export const PerksDirectory = ({ perks }: PerksDirectoryProps) => {
  const [filter, setFilter] = useQueryState("filter", filterParser);
  const [search, setSearch] = useQueryState("search", searchParser);

  const filteredPerks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return perks.filter((perk) => {
      if (filter === "free" && perk.badge !== "FREE") {
        return false;
      }

      if (filter === "voucher" && perk.badge !== "VOUCHER") {
        return false;
      }

      if (!query) {
        return true;
      }

      const matchesBrand = perk.brand.name.toLowerCase().includes(query);
      const matchesHeadline = perk.headline.toLowerCase().includes(query);

      const matchesPerks = perk.perksList?.some((item) =>
        item.toLowerCase().includes(query)
      );

      return matchesBrand || matchesHeadline || matchesPerks;
    });
  }, [perks, filter, search]);

  const hasActiveFilters = filter !== "all" || Boolean(search.trim());

  return (
    <section aria-labelledby="shops-heading" className="space-y-6">
      <h2 className="sr-only" id="shops-heading">
        featured birthday perks
      </h2>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          onValueChange={(val) => {
            if (val === "all" || val === "free" || val === "voucher") {
              setFilter(val);
            }
          }}
          value={filter}
        >
          <TabsList>
            <TabsTrigger value="all">all</TabsTrigger>
            <TabsTrigger value="free">free</TabsTrigger>
            <TabsTrigger value="voucher">voucher</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full sm:w-72">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="search birthday perks"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearch(null);
                }
              }}
              placeholder="search brand, treat, perk..."
              value={search}
            />
            {search ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="clear search"
                  onClick={() => setSearch(null)}
                  variant="ghost"
                >
                  <X />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </div>
      </div>

      {/* Perks Grid or Empty State */}
      {filteredPerks.length === 0 ? (
        <Empty className="my-8">
          <EmptyMedia variant="icon">
            <Search />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>no perks found</EmptyTitle>
            <EmptyDescription>
              we couldn&apos;t find any birthday perks matching your criteria.
              try adjusting your search or filter.
            </EmptyDescription>
          </EmptyHeader>
          {hasActiveFilters ? (
            <EmptyContent>
              <Button
                onClick={() => {
                  setFilter("all");
                  setSearch(null);
                }}
                variant="outline"
              >
                clear filters
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredPerks.map((perk) => (
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
      )}
    </section>
  );
};
