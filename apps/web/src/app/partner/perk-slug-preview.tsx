"use client";

import type { SubmitPartnerPerkInput } from "@befday-2.0/contracts";
import { Avatar, AvatarFallback } from "@befday-2.0/ui/components/avatar";
import { Badge } from "@befday-2.0/ui/components/badge";
import { buttonVariants } from "@befday-2.0/ui/components/button";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@befday-2.0/ui/components/web-preview";
import { cn } from "@befday-2.0/ui/lib/utils";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

import { formatShortDate } from "@/utils/date";

export interface PerkSlugPreviewProps {
  className?: string;
  values: SubmitPartnerPerkInput;
}

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/gu, "")
    .replaceAll(/[\s_-]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "");

const PREVIEW_VERIFIED_DATE = formatShortDate(new Date()).toLowerCase();

export const PerkSlugPreview = ({
  className,
  values,
}: PerkSlugPreviewProps) => {
  const {
    appStoreUrl,
    badge,
    brandName,
    googleMapUrl,
    headline,
    howToRedeem,
    perksList,
    playStoreUrl,
    validity,
    websiteUrl,
  } = values;

  const displayName = brandName.trim() || "your brand name";
  const slug = toSlug(brandName);

  const perks = perksList
    .split(/[,;\n]/u)
    .map((s) => s.trim())
    .filter(Boolean);

  const redeemSteps = howToRedeem
    .split(/\n+/u)
    .map((s) => s.trim())
    .filter(Boolean);

  const hasAnyLink = Boolean(
    googleMapUrl || websiteUrl || appStoreUrl || playStoreUrl
  );

  const previewUrl = `https://befday.com/perks/${slug || "your-brand"}`;

  return (
    <WebPreview className={className}>
      {/* Mockup Browser Navigation */}
      <WebPreviewNavigation>
        <div className="flex items-center gap-1">
          <WebPreviewNavigationButton action="back" disabled />
          <WebPreviewNavigationButton action="forward" disabled />
          <WebPreviewNavigationButton action="reload" />
        </div>
        <WebPreviewUrl value={previewUrl} />
      </WebPreviewNavigation>

      {/* Replicated /perks/[slug] Layout */}
      <WebPreviewBody>
        <div className="mx-auto max-w-xl p-6 sm:p-8">
          {/* Navigation Breadcrumb / Back button preview */}
          <div className="mb-6">
            <span
              className={cn(
                buttonVariants({ size: "sm", variant: "link" }),
                "pointer-events-none px-0 text-xs"
              )}
            >
              back to perks
            </span>
          </div>

          <article className="space-y-6">
            {/* Brand Icon / Logo */}
            <Avatar size="lg">
              {/* oxlint-disable-next-line shadcn/no-restyle */}
              <AvatarFallback className="overflow-hidden p-0">
                {/* oxlint-disable-next-line next/no-img-element */}
                <img
                  alt={displayName}
                  className="size-full object-cover"
                  src={`https://api.dicebear.com/10.x/loops/svg?seed=${encodeURIComponent(
                    brandName.trim() || "befday-brand"
                  )}`}
                />
              </AvatarFallback>
            </Avatar>

            {/* Brand Title & Badge */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-foreground text-2xl font-bold tracking-tight lowercase sm:text-3xl">
                  {displayName.toLowerCase()}
                </h2>
                <Badge variant="outline">
                  {badge === "FREE" ? "free" : "voucher"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed lowercase sm:text-base">
                {(headline.trim() || "not specified").toLowerCase()}
              </p>
            </div>

            {/* Action Links */}
            {hasAnyLink && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {googleMapUrl && (
                  <a
                    className={buttonVariants({
                      size: "default",
                      variant: "link",
                    })}
                    href={googleMapUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    location
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                )}
                {websiteUrl && (
                  <a
                    className={buttonVariants({
                      size: "default",
                      variant: "link",
                    })}
                    href={websiteUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    website
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                )}
                {appStoreUrl && (
                  <a
                    className={buttonVariants({
                      size: "default",
                      variant: "link",
                    })}
                    href={appStoreUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    app store
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                )}
                {playStoreUrl && (
                  <a
                    className={buttonVariants({
                      size: "default",
                      variant: "link",
                    })}
                    href={playStoreUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    play store
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                )}
              </div>
            )}

            {/* Detail Sections */}
            <div className="space-y-6 pt-4">
              {/* Section: Birthday Perks */}
              <section
                aria-labelledby="preview-perks-heading"
                className="space-y-2"
              >
                <h3
                  className="text-foreground text-base font-semibold lowercase"
                  id="preview-perks-heading"
                >
                  birthday perks
                </h3>
                {perks.length > 0 ? (
                  <ul className="text-foreground space-y-1.5 text-sm">
                    {perks.map((perkItem, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        <span className="text-muted-foreground select-none">
                          •
                        </span>
                        <span>{perkItem.toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm italic lowercase">
                    {(headline.trim() || "not specified").toLowerCase()}
                  </p>
                )}
              </section>

              {/* Section: Validity */}
              <section
                aria-labelledby="preview-validity-heading"
                className="space-y-2"
              >
                <h3
                  className="text-foreground text-base font-semibold lowercase"
                  id="preview-validity-heading"
                >
                  validity
                </h3>
                <p className="text-muted-foreground text-sm lowercase">
                  {(validity.trim() || "not specified").toLowerCase()}
                </p>
              </section>

              {/* Section: How To Redeem */}
              <section
                aria-labelledby="preview-redeem-heading"
                className="space-y-2"
              >
                <h3
                  className="text-foreground text-base font-semibold lowercase"
                  id="preview-redeem-heading"
                >
                  how to redeem
                </h3>
                {redeemSteps.length > 0 ? (
                  <ul className="text-foreground space-y-1.5 text-sm">
                    {redeemSteps.map((step, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        <span className="text-muted-foreground select-none">
                          •
                        </span>
                        <span>{step.toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm italic lowercase">
                    not specified
                  </p>
                )}
              </section>
            </div>

            {/* Inline Verified Badge Mockup */}
            <div className="flex items-center justify-end pt-4">
              <div className="bg-background/80 text-muted-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs shadow-xs backdrop-blur-md select-none tabular-nums">
                <BadgeCheck className="text-primary size-3.5 shrink-0" />
                verified {PREVIEW_VERIFIED_DATE}
              </div>
            </div>
          </article>
        </div>
      </WebPreviewBody>
    </WebPreview>
  );
};
