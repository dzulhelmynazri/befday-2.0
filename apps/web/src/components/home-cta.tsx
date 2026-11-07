"use client";

import { Button } from "@befday-2.0/ui/components/button";
import { Skeleton } from "@befday-2.0/ui/components/skeleton";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

export const HeroCta = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-6 w-32" />;
  }

  if (session?.user) {
    const firstName = session.user.name.trim().split(/\s+/u)[0]?.toLowerCase();

    return (
      <p className="text-muted-foreground text-base lowercase sm:text-lg">
        welcome, {firstName}!
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <Button
        className="sm:w-full"
        nativeButton={false}
        render={<Link href="/auth" />}
        size="lg"
      >
        sign up to unlock perks
      </Button>
      <span className="text-muted-foreground text-xs lowercase">
        100% free · with google in 10s
      </span>
    </div>
  );
};
