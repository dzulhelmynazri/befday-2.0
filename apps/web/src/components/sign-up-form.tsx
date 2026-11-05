import { Button } from "@befday-2.0/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@befday-2.0/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@befday-2.0/ui/components/field";
import { Input } from "@befday-2.0/ui/components/input";
import { Github } from "@befday-2.0/ui/socials/github";
import { Google } from "@befday-2.0/ui/socials/google";
import { Linkedin } from "@befday-2.0/ui/socials/linkedin";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

const signInWithSocial = async (provider: "github" | "google" | "linkedin") => {
  await authClient.signIn.social(
    {
      callbackURL: "/dashboard",
      provider,
    },
    {
      onError: (error) => {
        toast.error(error.error.message);
      },
    },
  );
};

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          name: value.name,
          password: value.password,
        },
        {
          onError: (error) => {
            toast.error(error.error.message);
          },
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign up successful");
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        name: z.string().min(2, "Name must be at least 2 characters"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <Field>
              <Button type="button" variant="outline" onClick={() => signInWithSocial("google")}>
                <Google data-icon="inline-start" />
                Continue with Google
              </Button>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Button type="button" variant="link" onClick={onSwitchToSignIn}>
                  Sign In
                </Button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
