import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@befday-2.0/ui/components/alert";
import { Avatar, AvatarFallback } from "@befday-2.0/ui/components/avatar";
import { Badge } from "@befday-2.0/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
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
import { MarkdownDocument } from "@comark/react";
import { createMarkdownParser } from "comark";
import type { MarkdownDocument as ComarkDocument } from "comark";
import toc from "comark/plugins/toc";
import { Gift } from "lucide-react";
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
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

interface PerkCardProps {
  badge?: "FREE" | "VOUCHER";
  brandName?: string;
  children: ReactNode;
  howToRedeem?: string;
}

export const ComarkPerkCard = ({
  badge = "FREE",
  brandName,
  children,
  howToRedeem,
}: PerkCardProps) => {
  const brandInitial = brandName ? brandName.charAt(0).toUpperCase() : null;

  return (
    <Card className="my-6">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback>
              {brandInitial ?? <Gift aria-hidden="true" />}
            </AvatarFallback>
          </Avatar>
          {brandName && <CardTitle>{brandName}</CardTitle>}
        </div>
        <CardAction>
          <Badge>{badge}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {howToRedeem && (
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            <strong>How to redeem:</strong> {howToRedeem}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export const ComarkSteps = ({ children }: { children: ReactNode }) => (
  <Card className="my-6" size="sm">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ComarkTimeline = ({ children }: { children: ReactNode }) => (
  <div className="border-primary/30 my-6 border-l-2 pl-4 [&>ul]:my-0 [&>ul]:space-y-3">
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
          className="text-primary font-medium underline underline-offset-4 hover:underline"
          href={href}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        className="text-primary font-medium underline underline-offset-4 hover:underline"
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
      className="border-primary/50 text-muted-foreground my-4 border-l-2 pl-4 text-xs italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  callout: ComarkCallout,
  check: ComarkChecklist,
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code
      className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs font-semibold"
      {...props}
    >
      {children}
    </code>
  ),
  h1: ({ children, id, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-foreground mt-8 mb-4 scroll-mt-20 text-2xl font-bold tracking-tight sm:text-3xl"
      id={id}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="border-border text-foreground mt-8 mb-3 scroll-mt-20 border-b pb-2 text-xl font-semibold tracking-tight"
      id={id}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-foreground mt-6 mb-2 scroll-mt-20 text-base font-semibold tracking-tight"
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
      className="my-4 flex flex-col gap-3 pl-0 [counter-reset:step] [&>li]:flex [&>li]:items-start [&>li]:gap-2.5 [&>li]:before:bg-primary/10 [&>li]:before:text-primary [&>li]:before:flex [&>li]:before:size-5 [&>li]:before:shrink-0 [&>li]:before:items-center [&>li]:before:justify-center [&>li]:before:rounded-full [&>li]:before:text-xs [&>li]:before:font-bold [&>li]:before:[counter-increment:step] [&>li]:before:content-[counter(step)]"
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
    <ul
      className="my-4 flex flex-col gap-2 pl-0 [&>li]:flex [&>li]:items-start [&>li]:gap-2 [&>li]:before:bg-primary [&>li]:before:mt-1.5 [&>li]:before:size-1 [&>li]:before:shrink-0 [&>li]:before:rounded-full"
      {...props}
    >
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
  <article className={className}>
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
    <Card size="sm">
      <CardHeader>
        <CardTitle>On this page</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 text-xs">
          {links.map((link) => (
            <li key={link.id}>
              <a
                className="text-muted-foreground hover:text-foreground transition-colors"
                href={`#${link.id}`}
              >
                {link.text}
              </a>
              {link.children && link.children.length > 0 && (
                <ul className="mt-1.5 ml-2 flex flex-col gap-1 border-l pl-2">
                  {link.children.map((subLink) => (
                    <li key={subLink.id}>
                      <a
                        className="text-muted-foreground/80 hover:text-foreground transition-colors"
                        href={`#${subLink.id}`}
                      >
                        {subLink.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
