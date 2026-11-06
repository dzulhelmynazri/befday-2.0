import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@befday-2.0/ui/components/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@befday-2.0/ui/components/avatar";
import { Badge } from "@befday-2.0/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@befday-2.0/ui/components/card";
import { Separator } from "@befday-2.0/ui/components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@befday-2.0/ui/components/table";
import { cn } from "@befday-2.0/ui/lib/utils";
import { MarkdownDocument } from "@comark/react";
import { createMarkdownParser } from "comark";
import type { MarkdownDocument as ComarkDocument } from "comark";
import toc from "comark/plugins/toc";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { z } from "zod";

export interface TocLink {
  children?: TocLink[];
  depth: number;
  id: string;
  text: string;
}

const tocSchema = z.object({
  toc: z.object({
    links: z.array(
      z.object({
        children: z
          .array(
            z.object({
              depth: z.number(),
              id: z.string(),
              text: z.string(),
            })
          )
          .optional(),
        depth: z.number(),
        id: z.string(),
        text: z.string(),
      })
    ),
  }),
});

export const parseBlogContent = createMarkdownParser({
  plugins: [toc({ depth: 3 })],
});

export const extractTocLinks = (doc: ComarkDocument): TocLink[] => {
  const result = tocSchema.safeParse(doc.meta);

  return result.success ? result.data.toc.links : [];
};

type CalloutType = "celebrate" | "info" | "tip" | "warning";

interface CalloutProps {
  children: ReactNode;
  title?: string;
  type?: CalloutType;
}

export const ComarkCallout = ({ children, title, type }: CalloutProps) => {
  const isDestructive = type === "warning";

  return (
    <Alert className="my-6" variant={isDestructive ? "destructive" : "default"}>
      {title && <AlertTitle>{title.toLowerCase()}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

interface PerkCardProps {
  badge: "FREE" | "VOUCHER";
  brandName: string;
  children: ReactNode;
  logoUrl: string;
}

export const ComarkPerkCard = ({
  badge = "FREE",
  brandName,
  children,
  logoUrl,
}: PerkCardProps) => (
  <Card className="in-[.grid]:my-0 my-6">
    <CardHeader>
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarImage alt={brandName} src={logoUrl} />
          <AvatarFallback>{brandName.charAt(0).toLowerCase()}</AvatarFallback>
        </Avatar>
        <CardTitle>{brandName.toLowerCase()}</CardTitle>
      </div>
      <CardAction>
        <Badge variant="outline">{badge.toLowerCase()}</Badge>
      </CardAction>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const ComarkSteps = ({ children }: { children: ReactNode }) => (
  <Card className="my-6" size="sm">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ComarkTimeline = ({ children }: { children: ReactNode }) => (
  <div className="border-border my-6 border-l pl-4 [&>ul]:my-0 [&>ul]:space-y-3">
    {children}
  </div>
);

export const ComarkChecklist = ({ children }: { children: ReactNode }) => (
  <Card className="my-6" size="sm">
    <CardContent>{children}</CardContent>
  </Card>
);

const customComponents = {
  a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isInternal = href?.startsWith("/") || href?.startsWith("#");

    if (isInternal && href) {
      return (
        <Link
          className="text-foreground decoration-border hover:decoration-foreground font-medium underline underline-offset-4 transition-colors"
          href={href}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        className="text-foreground decoration-border hover:decoration-foreground font-medium underline underline-offset-4 transition-colors"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  },
  alert: ComarkCallout,
  blockquote: ({
    children,
    ...props
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-border text-muted-foreground my-4 border-l-2 pl-4 text-xs italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  callout: ComarkCallout,
  check: ComarkChecklist,
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code
      className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs"
      {...props}
    >
      {children}
    </code>
  ),
  grid: ({ children }: { children: ReactNode }) => (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  ),
  h1: ({ children, id, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-foreground mt-8 mb-4 scroll-mt-20 text-2xl font-semibold tracking-tighter"
      id={id}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-foreground mt-8 mb-3 scroll-mt-20 text-xl font-medium tracking-tight"
      id={id}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-foreground mt-6 mb-2 scroll-mt-20 text-lg font-medium tracking-tight"
      id={id}
      {...props}
    >
      {children}
    </h3>
  ),
  hr: () => <Separator className="my-6" />,
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="text-xs/relaxed" {...props}>
      <div className="min-w-0 flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </li>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-4 list-decimal space-y-1.5 pl-5 text-xs/relaxed"
      {...props}
    >
      {children}
    </ol>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="text-foreground/90 my-3 text-xs/relaxed" {...props}>
      {children}
    </p>
  ),
  perk: ComarkPerkCard,
  "perk-card": ComarkPerkCard,
  "perk-highlight": ComarkPerkCard,
  steps: ComarkSteps,
  table: Table,
  tbody: TableBody,
  td: TableCell,
  th: TableHead,
  thead: TableHeader,
  timeline: ComarkTimeline,
  tr: TableRow,
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-4 list-disc space-y-1.5 pl-5 text-xs/relaxed" {...props}>
      {children}
    </ul>
  ),
};

interface ComarkRendererProps {
  className?: string;
  document: ComarkDocument;
}

export const ComarkRenderer = ({
  className,
  document,
}: ComarkRendererProps) => (
  <article
    className={cn(
      "lowercase [&_code]:normal-case [&_pre]:normal-case",
      className
    )}
  >
    <MarkdownDocument components={customComponents} value={document} />
  </article>
);

interface BlogTableOfContentsProps {
  links: readonly TocLink[];
}

export const BlogTableOfContents = ({ links }: BlogTableOfContentsProps) => {
  if (links.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-2.5">
      <p className="text-muted-foreground text-xs font-semibold tracking-wider">
        on this page
      </p>
      <ul className="flex flex-col gap-1.5 text-xs">
        {links.map((link) => (
          <li key={link.id}>
            <a
              className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
              href={`#${link.id}`}
            >
              {link.text.toLowerCase()}
            </a>
            {link.children && link.children.length > 0 && (
              <ul className="border-border mt-1 ml-2.5 flex flex-col gap-1 border-l pl-2">
                {link.children.map((subLink) => (
                  <li key={subLink.id}>
                    <a
                      className="text-muted-foreground/80 hover:text-foreground transition-colors hover:underline"
                      href={`#${subLink.id}`}
                    >
                      {subLink.text.toLowerCase()}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
