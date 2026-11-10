import {
  renderAddBirthdayPromptEmail,
  renderWelcomeEmail,
} from "@befday-2.0/email";
import { sleep } from "workflow";

import { sendEmailWithRetry } from "@/lib/workflows";

interface OnboardingUserInput {
  readonly email: string;
  readonly id: string;
  readonly name: string;
}

interface OnboardingResult {
  readonly status: "completed" | "prompted" | "skipped";
}

const sendWelcomeEmail = async (user: OnboardingUserInput): Promise<void> => {
  "use step";

  const { html, text } = await renderWelcomeEmail({
    name: user.name.toLowerCase(),
    perksUrl: "https://www.befday.com",
  });

  await sendEmailWithRetry({
    context: { userId: user.id },
    event: "onboarding.welcome_email_failed",
    html,
    subject: "welcome to befday — your birthday perks are waiting",
    text,
    to: user.email,
  });
};

sendWelcomeEmail.maxRetries = 5;

const sendBirthdayPromptIfMissing = async (
  userId: string
): Promise<OnboardingResult> => {
  "use step";

  const { getDb } = await import("@/services");

  const user = await getDb().user.findUnique({
    select: { dateOfBirth: true, email: true, name: true },
    where: { id: userId },
  });

  if (!user) {
    return { status: "skipped" };
  }

  if (user.dateOfBirth !== null) {
    return { status: "completed" };
  }

  const { html, text } = await renderAddBirthdayPromptEmail({
    name: user.name.toLowerCase(),
    profileUrl: "https://www.befday.com/onboarding",
  });

  await sendEmailWithRetry({
    context: { userId },
    event: "onboarding.birthday_prompt_failed",
    html,
    subject: "one quick step — add your birthday on befday",
    text,
    to: user.email,
  });

  return { status: "prompted" };
};

sendBirthdayPromptIfMissing.maxRetries = 5;

export const userOnboardingWorkflow = async (
  user: OnboardingUserInput
): Promise<OnboardingResult> => {
  "use workflow";

  await sendWelcomeEmail(user);
  await sleep("3d");

  return sendBirthdayPromptIfMissing(user.id);
};
