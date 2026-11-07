"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { DitheredLogo } from "@/components/dithercn/dithered-logo";
import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

import { OnboardingForm } from "./onboarding-form";

const OnboardingPage = () => {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { data: profileData, isPending: isProfilePending } = useQuery({
    ...trpc.user.me.queryOptions(),
    enabled: Boolean(session?.user),
  });

  useEffect(() => {
    if (!isSessionPending && !session?.user) {
      router.replace("/auth");
    }
  }, [isSessionPending, session, router]);

  useEffect(() => {
    if (profileData?.isOnboarded) {
      router.replace("/");
    }
  }, [profileData, router]);

  if (isSessionPending || (session?.user && isProfilePending)) {
    return (
      <div className="flex min-h-svh flex-1 items-center justify-center p-4">
        <Loader />
      </div>
    );
  }

  if (!session?.user || profileData?.isOnboarded) {
    return null;
  }

  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      {/* Left Column: Interactive Dithered Logo */}
      <aside className="border-border bg-muted/20 relative hidden flex-col items-center justify-center overflow-hidden border-r p-8 lg:flex">
        <div className="flex size-full max-w-md flex-col items-center justify-center gap-6">
          <DitheredLogo
            alt="befday logo"
            cell={2}
            className="size-64 sm:size-72"
            color="ink"
            effect="shimmer"
            fill="gradient"
            lazy={false}
            outline
            period={4}
            src="/logo.svg"
          />
          <p className="text-muted-foreground text-xs lowercase">
            never miss a birthday perk in malaysia
          </p>
        </div>
      </aside>

      {/* Right Column: Onboarding Form */}
      <main className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-lg">
          <OnboardingForm initialName={session.user.name ?? ""} />
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
