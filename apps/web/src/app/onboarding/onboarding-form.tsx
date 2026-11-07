"use client";

import { completeProfileSchema } from "@befday-2.0/contracts";
import type { CompleteProfileInput } from "@befday-2.0/contracts";
import { Button } from "@befday-2.0/ui/components/button";
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
        toast.error("Unable to save profile. Please try again.");
      }
    },
    validators: {
      onSubmit: completeProfileSchema,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-foreground text-balance text-2xl font-semibold tracking-tight">
          complete your profile
        </h1>
      </div>

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
                  <FieldLabel htmlFor={field.name}>full name</FieldLabel>
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
                  <FieldLabel htmlFor={field.name}>date of birth</FieldLabel>
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
                    we&apos;ll remind you before your birthday month starts so
                    you never miss free treats, meals, and vouchers. (must be
                    13+).
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
          {completeProfile.isPending && <Spinner data-icon="inline-start" />}
          unlock my birthday perks
        </Button>
      </form>
    </div>
  );
};
