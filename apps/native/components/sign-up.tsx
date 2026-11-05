import { useForm } from "@tanstack/react-form";
import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  Surface,
  TextField,
  useToast,
} from "heroui-native";
import type { InputRef } from "heroui-native";
import { useRef } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

const issueSchema = z.union([
  z.string(),
  z.object({ message: z.string() }).transform((v) => v.message),
]);

const errorPayloadSchema = z.union([
  z.string(),
  z.object({ message: z.string() }).transform((val) => val.message),
  z.array(issueSchema).transform((arr) => arr[0] ?? null),
  z
    .record(z.string(), z.union([issueSchema, z.array(issueSchema)]))
    .transform((obj) => {
      const [firstVal] = Object.values(obj);

      if (!firstVal) {
        return null;
      }

      return Array.isArray(firstVal) ? (firstVal[0] ?? null) : firstVal;
    }),
]);

type IssueItem = { message?: string } | string;

type FormError =
  | string
  | IssueItem
  | IssueItem[]
  | Record<string, IssueItem | IssueItem[] | undefined>
  | null
  | undefined;

const getErrorMessage = (error: FormError): string | null => {
  if (!error) {
    return null;
  }

  const result = errorPayloadSchema.safeParse(error);

  return result.success ? result.data : null;
};

export const SignUp = () => {
  const emailInputRef = useRef<InputRef>(null);
  const passwordInputRef = useRef<InputRef>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signUp.email(
        {
          email: value.email.trim(),
          name: value.name.trim(),
          password: value.password,
        },
        {
          onError(error) {
            toast.show({
              label: error.error?.message || "Failed to sign up",
              variant: "danger",
            });
          },
          onSuccess() {
            formApi.reset();
            toast.show({
              label: "Account created successfully",
              variant: "success",
            });
            queryClient.refetchQueries();
          },
        }
      );
    },
    validators: {
      onSubmit: signUpSchema,
    },
  });

  return (
    <Surface variant="secondary" className="rounded-lg p-4">
      <Text className="text-foreground mb-4 font-medium">Create Account</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = validationError;

          return (
            <>
              <FieldError isInvalid={!!formError} className="mb-3">
                {formError}
              </FieldError>

              <View className="gap-3">
                <form.Field name="name">
                  {(field) => (
                    <TextField>
                      <Label>Name</Label>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="John Doe"
                        autoComplete="name"
                        textContentType="name"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          emailInputRef.current?.focus();
                        }}
                      />
                    </TextField>
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <TextField>
                      <Label>Email</Label>
                      <Input
                        ref={emailInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                      />
                    </TextField>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <TextField>
                      <Label>Password</Label>
                      <Input
                        ref={passwordInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="go"
                        onSubmitEditing={form.handleSubmit}
                      />
                    </TextField>
                  )}
                </form.Field>

                <Button
                  onPress={form.handleSubmit}
                  isDisabled={isSubmitting}
                  className="mt-1"
                >
                  {isSubmitting ? (
                    <Spinner size="sm" color="default" />
                  ) : (
                    <Button.Label>Create Account</Button.Label>
                  )}
                </Button>
              </View>
            </>
          );
        }}
      </form.Subscribe>
    </Surface>
  );
};
