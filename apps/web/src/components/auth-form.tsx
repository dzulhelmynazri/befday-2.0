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
import { toast } from "sonner";

import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";

const signInWithSocial = async () => {
  await authClient.signIn.social(
    {
      callbackURL: "/dashboard",
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
  const { isPending } = authClient.useSession();

  if (isPending) {
    return <Loader />;
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
