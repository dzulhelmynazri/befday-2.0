import { Skeleton } from "@befday-2.0/ui/components/skeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { getDb } from "@/services";
import { formatShortDate } from "@/utils/date";

export const metadata: Metadata = {
  description:
    "Curated guides, verified free treats, secret vouchers, and step-by-step birthday redemption tips.",
  title: "Blog | befday",
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
  await connection();
  const db = getDb();

  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    where: { status: "PUBLISHED" },
  });

  return (
    <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">blog</h1>

      {posts.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No articles published yet.
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
                {post.title}
              </p>
              <p className="text-muted-foreground w-28 shrink-0 text-xs tabular-nums md:text-right">
                {formatShortDate(post.publishedAt)}
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
