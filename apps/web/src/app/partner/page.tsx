import type { Metadata } from "next";

import { PartnerForm } from "./partner-form";

export const metadata: Metadata = {
  alternates: {
    canonical: "/partner",
  },
  description:
    "feature your business on befday. submit your official birthday perks, free treats, and exclusive customer rewards.",
  title: "submit a birthday perk",
};

const PartnerPage = () => (
  <main className="container mx-auto max-w-2xl px-4 py-16 sm:py-20">
    <header className="mb-10">
      <h1 className="text-foreground text-3xl font-extrabold tracking-tight lowercase sm:text-4xl">
        submit a birthday perk
      </h1>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed lowercase sm:text-base">
        own a cafe, restaurant, entertainment spot, or retail brand? get your
        birthday perks featured on befday to reach thousands of celebrants.
      </p>
    </header>

    <PartnerForm />
  </main>
);

export default PartnerPage;
