import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { getDb } from "@/services";

export const metadata: Metadata = {
  description:
    "Discover the best birthday treats, free perks, dining vouchers, and secret birthday rewards across top brands.",
  title: "Birthday Guides & Perks Blog | befday",
};

const BlogListSkeleton = () => (
  <div className="grid gap-8">
    {[1, 2, 3].map((i) => (
      <div
        className="h-44 animate-pulse rounded-2xl border bg-muted/40 p-6"
        key={i}
      />
    ))}
  </div>
);

const BlogList = async () => {
  await connection();
  const db = getDb();

  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    where: { status: "PUBLISHED" },
  });

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h2 className="text-lg font-medium text-foreground">
          No articles published yet
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Our Birthday Discovery Agent is currently researching fresh guides.
          Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {posts.map((post) => {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(post.publishedAt));

        return (
          <article
            className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            key={post.id}
          >
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={post.publishedAt.toISOString()}>
                  {formattedDate}
                </time>
                <span>•</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      key={tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                <Link
                  className="focus:outline-hidden"
                  href={`/blog/${post.slug}`}
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  {post.title}
                </Link>
              </h2>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-semibold text-primary">
              Read complete guide
              <svg
                aria-hidden="true"
                className="ml-1.5 size-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </article>
        );
      })}
    </div>
  );
};

const BlogIndexPage = () => (
  <div className="container mx-auto max-w-4xl px-4 py-12">
    <header className="mb-12 border-b pb-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Birthday Perks & Freebies Blog
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Curated guides, verified free meals, secret vouchers, and step-by-step
        redemption tips for your special month.
      </p>
    </header>

    <Suspense fallback={<BlogListSkeleton />}>
      <BlogList />
    </Suspense>
  </div>
);

export default BlogIndexPage;
