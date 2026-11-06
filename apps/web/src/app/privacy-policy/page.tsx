import type { Metadata } from "next";

import { ComarkRenderer, parseBlogContent } from "@/components/comark-renderer";
import { privacyPolicyContent } from "@/content/privacy-policy";

export const metadata: Metadata = {
  alternates: {
    canonical: "/privacy-policy",
  },
  description:
    "privacy policy for befday — learn how we protect and respect your privacy.",
  title: "privacy policy",
};

const PrivacyPolicyPage = async () => {
  const document = await parseBlogContent(privacyPolicyContent);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <header className="mb-8">
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight lowercase sm:text-4xl">
          privacy policy
        </h1>
        <p className="text-muted-foreground mt-2 text-sm lowercase">
          last updated: november 2026
        </p>
      </header>

      <ComarkRenderer document={document} />
    </main>
  );
};

export default PrivacyPolicyPage;
