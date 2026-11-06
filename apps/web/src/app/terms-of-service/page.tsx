import type { Metadata } from "next";

import { ComarkRenderer, parseBlogContent } from "@/components/comark-renderer";
import { termsOfServiceContent } from "@/content/terms-of-service";

export const metadata: Metadata = {
  alternates: {
    canonical: "/terms-of-service",
  },
  description:
    "terms of service for befday — terms and conditions for using our birthday perk directory.",
  title: "terms of service",
};

const TermsOfServicePage = async () => {
  const document = await parseBlogContent(termsOfServiceContent);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <header className="mb-8">
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight lowercase sm:text-4xl">
          terms of service
        </h1>
        <p className="text-muted-foreground mt-2 text-sm lowercase">
          last updated: november 2026
        </p>
      </header>

      <ComarkRenderer document={document} />
    </main>
  );
};

export default TermsOfServicePage;
