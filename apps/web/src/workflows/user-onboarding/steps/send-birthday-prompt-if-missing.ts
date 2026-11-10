import { renderAddBirthdayPromptEmail } from "@befday-2.0/email";

import { getDb } from "@/services";
import { sendEmailWithRetry } from "@/workflows/shared/send-email";

export interface OnboardingResult {
  readonly status: "completed" | "prompted" | "skipped";
}

export const sendBirthdayPromptIfMissing = async (
  userId: string
): Promise<OnboardingResult> => {
  "use step";

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
