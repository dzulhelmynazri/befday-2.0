import { Skeleton } from "@befday-2.0/ui/components/skeleton";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import {
  BlogTableOfContents,
  ComarkRenderer,
  extractTocLinks,
  parseBlogContent,
} from "@/components/comark-renderer";
import { getDb } from "@/services";
import { formatDate } from "@/utils/date";

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> => {
  await connection();
  const { slug } = await params;
  const db = getDb();

  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Article Not Found | befday",
    };
  }

  return {
    description: post.description,
    openGraph: {
      description: post.description,
      images: [{ url: post.coverImageUrl }],
      publishedTime: post.publishedAt.toISOString(),
      title: post.title,
      type: "article",
    },
    title: `${post.title} | befday`,
  };
};

export const BlogPostSkeleton = () => (
  <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
    <div className="mb-8">
      <Skeleton className="h-4 w-24" />
    </div>

    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="min-w-0">
        <Skeleton className="mb-3 h-9 w-3/4" />
        <Skeleton className="mb-8 h-4 w-28" />
        <Skeleton className="my-8 aspect-[16/9] w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-20 flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    </div>
  </main>
);

const BlogPostContent = async ({
  params,
}: {
  params: PageProps<"/blog/[slug]">["params"];
}) => {
  await connection();
  const { slug } = await params;
  const db = getDb();

  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  // Strip redundant leading # Title and leading blockquote if they mirror post.title / post.description
  const sanitizedContent = post.content
    .replace(/^#\s+[^\n]+\n+/u, "")
    .replace(/^>\s+[^\n]+\n+/u, "");

  const document = await parseBlogContent(sanitizedContent);
  const tocLinks = extractTocLinks(document);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-20">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-xs transition-colors"
          href="/blog"
        >
          ← back to blog
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        {/* Main Reading Column */}
        <article className="min-w-0">
          <h1 className="text-foreground text-2xl font-semibold tracking-tighter sm:text-3xl">
            {post.title}
          </h1>

          <div className="text-muted-foreground mt-2 mb-6 flex items-center justify-between text-xs">
            <p className="tabular-nums">{formatDate(post.publishedAt)}</p>
          </div>

          <div className="border-border bg-muted relative my-8 aspect-[16/9] w-full overflow-hidden rounded-xl border">
            <Image
              alt={post.title}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 680px"
              src={post.coverImageUrl}
            />
          </div>

          <ComarkRenderer document={document} />
        </article>

        {/* Floating Sticky TOC Sidebar */}
        {tocLinks.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <BlogTableOfContents links={tocLinks} />
            </div>
          </aside>
        )}
      </div>
    </main>
  );
};

const BlogPostPage = ({ params }: PageProps<"/blog/[slug]">) => (
  <Suspense fallback={<BlogPostSkeleton />}>
    <BlogPostContent params={params} />
  </Suspense>
);

export default BlogPostPage;
