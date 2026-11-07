"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    return <Loader />;
  }

  if (!session?.user || profileData?.isOnboarded) {
    return null;
  }

  return (
    <main className="w-full max-w-lg">
      <OnboardingForm initialName={session.user.name ?? ""} />
    </main>
  );
};

export default OnboardingPage;
