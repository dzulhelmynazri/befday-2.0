import { Skeleton } from "@befday-2.0/ui/components/skeleton";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

import { formatShortDate } from "@/utils/date";
import { getCurrentYear } from "@/utils/get-current-year";
import { getPublicApi } from "@/utils/trpc-server";

export const generateMetadata = async (): Promise<Metadata> => {
  const currentYear = await getCurrentYear();

  return {
    alternates: {
      canonical: "/blog",
    },
    description:
      "Curated birthday guides, verified free treats, secret vouchers, and step-by-step redemption tips in Malaysia.",
    openGraph: {
      description:
        "Curated birthday guides, verified free treats, secret vouchers, and step-by-step redemption tips in Malaysia.",
      images: [
        {
          alt: "befday birthday guides & tips",
          height: 630,
          url: "/og?title=Birthday%20Guides%20%26%20Tips",
          width: 1200,
        },
      ],
      title: `Birthday Freebies & Strategy Guides (${currentYear})`,
      type: "website",
      url: "/blog",
    },
    title: `Birthday Guides & Strategy Tips (${currentYear})`,
    twitter: {
      card: "summary_large_image",
      description:
        "Curated birthday guides, verified free treats, secret vouchers, and step-by-step redemption tips in Malaysia.",
      images: ["/og?title=Birthday%20Guides%20%26%20Tips"],
      title: `Birthday Guides & Strategy Tips (${currentYear})`,
    },
  };
};

export const BlogIndexSkeleton = () => (
  <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
    <h1 className="mb-8 text-2xl font-semibold tracking-tighter">blog</h1>
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-1 py-1 md:flex-row md:items-baseline md:gap-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-28 shrink-0 md:ml-auto" />
      </div>
      <div className="flex flex-col justify-between gap-1 py-1 md:flex-row md:items-baseline md:gap-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-28 shrink-0 md:ml-auto" />
      </div>
      <div className="flex flex-col justify-between gap-1 py-1 md:flex-row md:items-baseline md:gap-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-28 shrink-0 md:ml-auto" />
      </div>
      <div className="flex flex-col justify-between gap-1 py-1 md:flex-row md:items-baseline md:gap-4">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-28 shrink-0 md:ml-auto" />
      </div>
      <div className="flex flex-col justify-between gap-1 py-1 md:flex-row md:items-baseline md:gap-4">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-28 shrink-0 md:ml-auto" />
      </div>
    </div>
  </main>
);

const BlogIndexContent = async () => {
  "use cache";
  cacheLife("days");
  cacheTag("blog");

  const api = getPublicApi();
  const posts = await api.blog.all();

  return (
    <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">blog</h1>

      {posts.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">
            no articles published yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              className="group flex flex-col justify-between gap-1 py-1 transition-opacity hover:opacity-80 md:flex-row md:items-baseline md:gap-4"
              href={`/blog/${post.slug}`}
              key={post.id}
            >
              <p className="text-foreground group-hover:text-primary text-sm font-medium tracking-tight transition-colors">
                {post.title.toLowerCase()}
              </p>
              <p className="text-muted-foreground w-28 shrink-0 text-xs tabular-nums md:text-right">
                {formatShortDate(post.publishedAt).toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

const BlogIndexPage = () => (
  <Suspense fallback={<BlogIndexSkeleton />}>
    <BlogIndexContent />
  </Suspense>
);

export default BlogIndexPage;
