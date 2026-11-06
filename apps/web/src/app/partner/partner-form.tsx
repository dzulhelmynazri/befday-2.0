"use client";

import { submitPartnerPerkSchema } from "@befday-2.0/contracts";
import type { SubmitPartnerPerkInput } from "@befday-2.0/contracts";
import { Button } from "@befday-2.0/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@befday-2.0/ui/components/field";
import { Input } from "@befday-2.0/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@befday-2.0/ui/components/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@befday-2.0/ui/components/item";
import {
  RadioGroup,
  RadioGroupItem,
} from "@befday-2.0/ui/components/radio-group";
import { Spinner } from "@befday-2.0/ui/components/spinner";
import { Textarea } from "@befday-2.0/ui/components/textarea";
import { Apple, Gmail, GoogleMaps, GooglePlay } from "@befday-2.0/ui/socials";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";

const defaultValues: SubmitPartnerPerkInput = {
  appStoreUrl: "",
  badge: "FREE",
  brandName: "",
  contactEmail: "",
  contactName: "",
  contactPhone: "",
  googleMapUrl: "",
  headline: "",
  howToRedeem: "",
  perksList: "",
  playStoreUrl: "",
  validity: "",
  websiteUrl: "",
};

export const PartnerForm = () => {
  const submitPerk = useMutation(trpc.partner.submit.mutationOptions());

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        await submitPerk.mutateAsync(value);
        toast.success("perk submitted! we will review and publish it shortly.");
      } catch {
        toast.error("failed to submit perk. please try again.");
      }
    },
    validators: {
      onSubmit: submitPartnerPerkSchema,
    },
  });

  if (submitPerk.isSuccess && submitPerk.data) {
    return (
      <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border p-8 text-center shadow-xs">
        <CheckCircle2 className="text-primary mb-3 size-10" />
        <h2 className="text-foreground text-xl font-bold tracking-tight lowercase">
          submission received!
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm lowercase">
          thank you for submitting{" "}
          <strong>{submitPerk.data.brandName.toLowerCase()}</strong>. our team
          will review and publish your birthday perk shortly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              form.reset();
              submitPerk.reset();
            }}
            variant="outline"
          >
            submit another perk
          </Button>
          <Button nativeButton={false} render={<Link href="/" />}>
            browse perks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* 1. Brand & Business Details */}
      <FieldGroup>
        <form.Field name="brandName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>brand name</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="organization"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. the daily grind cafe"
                  value={field.state.value}
                />
                <FieldDescription>
                  official name of your cafe, restaurant, or business.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="headline">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>perk headline</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. free slice of cake with any handcrafted coffee"
                  value={field.state.value}
                />
                <FieldDescription>
                  a short, enticing title highlighting what the customer gets.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Reward Type (FREE vs VOUCHER) */}
        <form.Field name="badge">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <FieldSet>
                <FieldLegend variant="label">reward type</FieldLegend>
                <RadioGroup
                  name={field.name}
                  onValueChange={(val) => {
                    if (val === "FREE" || val === "VOUCHER") {
                      field.handleChange(val);
                    }
                  }}
                  value={field.state.value}
                >
                  <ItemGroup>
                    <Item
                      render={
                        <label
                          aria-label="free treat (no spend required)"
                          className="cursor-pointer"
                          htmlFor="type-free"
                        />
                      }
                      variant="outline"
                    >
                      <ItemMedia>
                        <RadioGroupItem
                          aria-invalid={isInvalid}
                          id="type-free"
                          value="FREE"
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>free treat (no spend required)</ItemTitle>
                        <ItemDescription>
                          100% complimentary item (e.g. free drink, free
                          dessert, free ticket).
                        </ItemDescription>
                      </ItemContent>
                    </Item>

                    <Item
                      render={
                        <label
                          aria-label="voucher or discount (spend required)"
                          className="cursor-pointer"
                          htmlFor="type-voucher"
                        />
                      }
                      variant="outline"
                    >
                      <ItemMedia>
                        <RadioGroupItem
                          aria-invalid={isInvalid}
                          id="type-voucher"
                          value="VOUCHER"
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          voucher / discount (spend required)
                        </ItemTitle>
                        <ItemDescription>
                          discount percentage, cash rebate, or perk with minimum
                          spend.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </RadioGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.Field>
      </FieldGroup>

      {/* 2. Perk Details & Redemption */}
      <FieldGroup>
        <form.Field name="perksList">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  treats / perks list
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. free chocolate lava cake, 10% birthday discount"
                  value={field.state.value}
                />
                <FieldDescription>
                  comma-separated list of exact items the celebrant receives.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="validity">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>validity window</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. birthday month, birthday week, or actual birthday"
                  value={field.state.value}
                />
                <FieldDescription>
                  how long the celebrant has to claim the reward.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="howToRedeem">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>how to redeem</FieldLabel>
                <Textarea
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. show physical IC/ID at the counter and flash our mobile membership barcode."
                  value={field.state.value}
                />
                <FieldDescription>
                  clear instructions for customers to redeem at your store.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {/* 3. Links & Store Locator */}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <form.Field name="websiteUrl">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    website URL (optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Globe />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={isInvalid}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://yourbrand.com"
                      type="url"
                      value={field.state.value ?? ""}
                    />
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="googleMapUrl">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    google maps / store locator (optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <GoogleMaps />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={isInvalid}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      type="url"
                      value={field.state.value ?? ""}
                    />
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="appStoreUrl">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    apple app store URL (optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Apple />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={isInvalid}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://apps.apple.com/..."
                      type="url"
                      value={field.state.value ?? ""}
                    />
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="playStoreUrl">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    google play store URL (optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <GooglePlay />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={isInvalid}
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://play.google.com/..."
                      type="url"
                      value={field.state.value ?? ""}
                    />
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
      </FieldGroup>

      {/* 4. Merchant Contact (For Verification & Approval) */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">
            contact info (for approval & verification)
          </FieldLegend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <form.Field name="contactName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>your name</FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      autoComplete="name"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. sarah tan"
                      value={field.state.value}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="contactEmail">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>email address</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Gmail />
                      </InputGroupAddon>
                      <InputGroupInput
                        aria-invalid={isInvalid}
                        autoComplete="email"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="sarah@yourbrand.com"
                        type="email"
                        value={field.state.value}
                      />
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="contactPhone">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      phone / whatsapp (optional)
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      autoComplete="tel"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="+6012-3456789"
                      type="tel"
                      value={field.state.value ?? ""}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </FieldSet>
      </FieldGroup>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <Button
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  submitting perk...
                </>
              ) : (
                "submit birthday perk"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};
