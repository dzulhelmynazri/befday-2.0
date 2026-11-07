"use client";

import { Button } from "@befday-2.0/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@befday-2.0/ui/components/card";
import { Google } from "@befday-2.0/ui/socials/google";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

const signInWithSocial = async () => {
  await authClient.signIn.social(
    {
      callbackURL: "/onboarding",
      provider: "google",
    },
    {
      onError: (error) => {
        toast.error(error.error.message);
      },
    }
  );
};

const AuthForm = () => {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { data: profileData, isPending: isProfilePending } = useQuery({
    ...trpc.user.me.queryOptions(),
    enabled: Boolean(session?.user),
  });

  useEffect(() => {
    if (session?.user && !isProfilePending) {
      if (profileData?.isOnboarded) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [session, profileData, isProfilePending, router]);

  if (isSessionPending || (session?.user && isProfilePending)) {
    return <Loader />;
  }

  if (session?.user) {
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Sign in or create your account with Google to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          size="lg"
          type="button"
          variant="outline"
          onClick={signInWithSocial}
        >
          <Google data-icon="inline-start" />
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
