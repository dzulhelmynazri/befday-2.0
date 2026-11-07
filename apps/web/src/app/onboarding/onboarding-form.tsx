"use client";

import { completeProfileSchema } from "@befday-2.0/contracts";
import type { CompleteProfileInput } from "@befday-2.0/contracts";
import { Button } from "@befday-2.0/ui/components/button";
import {
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
} from "@befday-2.0/ui/components/field";
import { Input } from "@befday-2.0/ui/components/input";
import { Spinner } from "@befday-2.0/ui/components/spinner";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cake } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";

const getDobLimits = () => {
  const today = new Date();
  const maxYear = today.getUTCFullYear() - 13;
  const month = String(today.getUTCMonth() + 1).padStart(2, "0");
  const day = String(today.getUTCDate()).padStart(2, "0");

  return {
    maxDate: `${maxYear}-${month}-${day}`,
    minDate: `${today.getUTCFullYear() - 120}-${month}-${day}`,
  };
};

const { maxDate, minDate } = getDobLimits();

interface OnboardingFormProps {
  initialName?: string;
}

export const OnboardingForm = ({ initialName = "" }: OnboardingFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const completeProfile = useMutation(
    trpc.user.completeProfile.mutationOptions()
  );

  const defaultValues: CompleteProfileInput = {
    dateOfBirth: "",
    name: initialName,
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        await completeProfile.mutateAsync(value);
        await queryClient.invalidateQueries(trpc.user.me.queryFilter());
        toast.success("Profile saved! Your birthday perks are unlocked 🎉");
        router.replace("/");
      } catch {
        toast.error("Failed to save profile");
      }
    },
    validators: {
      onSubmit: completeProfileSchema,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <CardHeader className="text-center">
        <div className="bg-primary/10 text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
          <Cake className="size-6" />
        </div>
        <CardTitle>Welcome to befday!</CardTitle>
        <CardDescription>
          Tell us your name and birthday so we can curate the best free drinks,
          treats, and birthday perks for your celebration.
        </CardDescription>
      </CardHeader>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Your Name</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="name"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Alex Tan"
                    value={field.state.value}
                  />
                  <FieldDescription>
                    The name cafes and stores will see when claiming perks.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="dateOfBirth">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    id={field.name}
                    max={maxDate}
                    min={minDate}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="date"
                    value={field.state.value}
                  />
                  <FieldDescription>
                    We&apos;ll send you a reminder before your birthday month
                    starts so you never miss your free treats, meals, and
                    vouchers. (Must be 13 or older).
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <Button
          className="w-full"
          disabled={completeProfile.isPending}
          size="lg"
          type="submit"
        >
          {completeProfile.isPending && <Spinner className="size-4" />}
          Unlock My Birthday Perks
        </Button>
      </form>
    </div>
  );
};
