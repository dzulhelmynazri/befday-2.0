import { Badge } from "@befday-2.0/ui/components/badge";
import { buttonVariants } from "@befday-2.0/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@befday-2.0/ui/components/card";
import { Separator } from "@befday-2.0/ui/components/separator";
import { ArrowLeft, Gift, Sparkles } from "lucide-react";
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

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
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
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      publishedTime: post.publishedAt.toISOString(),
      title: post.title,
      type: "article",
    },
    title: `${post.title} | befday`,
  };
};

const BlogPostSkeleton = () => (
  <main className="container mx-auto max-w-5xl px-4 py-12">
    <div className="bg-muted/50 mb-8 h-6 w-32 animate-pulse rounded-md" />
    <div className="bg-muted/50 mb-4 h-12 w-3/4 animate-pulse rounded-md" />
    <div className="bg-muted/40 mb-8 h-6 w-1/2 animate-pulse rounded-md" />
    <div className="bg-muted/30 mb-10 aspect-[21/9] w-full animate-pulse rounded-lg" />
    <div className="max-w-3xl space-y-4">
      <div className="bg-muted/30 h-4 w-full animate-pulse rounded-md" />
      <div className="bg-muted/30 h-4 w-5/6 animate-pulse rounded-md" />
      <div className="bg-muted/30 h-4 w-4/6 animate-pulse rounded-md" />
    </div>
  </main>
);

const BlogPostContent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
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

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  // Estimate read time based on word count (~200 wpm)
  const wordCount = post.content.split(/\s+/u).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10 sm:py-14">
      {/* Top Back Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          className={buttonVariants({ size: "sm", variant: "ghost" })}
          href="/blog"
        >
          <ArrowLeft aria-hidden="true" data-icon="inline-start" />
          Back to all guides
        </Link>
      </nav>

      {/* Main Editorial Header */}
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">
            <Sparkles aria-hidden="true" data-icon="inline-start" />
            Verified Guide
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {post.title}
        </h1>

        <p className="text-muted-foreground max-w-3xl text-sm/relaxed sm:text-base/relaxed">
          {post.description}
        </p>

        {/* Editorial Byline / Meta Bar */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs sm:gap-4">
          <time dateTime={post.publishedAt.toISOString()}>{formattedDate}</time>
          <span className="text-border">•</span>
          <span>{readTimeMinutes} min read</span>
          <span className="text-border">•</span>
          <span>Updated for 2026</span>
        </div>

        <Separator className="mt-2" />
      </header>

      {/* Hero Cover Image Banner */}
      {post.coverImageUrl && (
        <div className="border-border bg-muted relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-lg border">
          <Image
            alt={post.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            src={post.coverImageUrl}
          />
        </div>
      )}

      {/* Main Grid: Content + Sticky Sidebar */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* Article Body */}
        <div className="min-w-0">
          <ComarkRenderer document={document} />

          {/* Article Footer Banner */}
          <footer className="mt-14">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-primary/10 text-primary mx-auto flex size-9 items-center justify-center rounded-full">
                  <Gift aria-hidden="true" />
                </div>
                <CardTitle>Know a birthday perk we missed?</CardTitle>
                <CardDescription className="mx-auto max-w-md">
                  Our AI agents and community verify brand birthday perks every
                  single week. Explore our full live directory.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    className={buttonVariants({ variant: "default" })}
                    href="/"
                  >
                    Explore All Birthday Perks
                  </Link>
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    href="/blog"
                  >
                    More Birthday Guides
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </footer>
        </div>

        {/* Sticky Sidebar with TOC and Quick Actions */}
        {tocLinks.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-4">
              <BlogTableOfContents links={tocLinks} />

              {/* Sidebar Quick Card */}
              <Card size="sm">
                <CardHeader>
                  <CardTitle>Quick Perk Tip</CardTitle>
                  <CardDescription>
                    Save this guide before your birthday month so you never miss
                    loyalty app sign-up deadlines!
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
};

const BlogPostPage = ({ params }: BlogPostPageProps) => (
  <Suspense fallback={<BlogPostSkeleton />}>
    <BlogPostContent params={params} />
  </Suspense>
);

export default BlogPostPage;
