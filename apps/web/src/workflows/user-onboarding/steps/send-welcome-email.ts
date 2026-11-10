import { renderWelcomeEmail } from "@befday-2.0/email";

import { sendEmailWithRetry } from "@/workflows/shared/send-email";

export interface OnboardingUserInput {
  readonly email: string;
  readonly id: string;
  readonly name: string;
}

export const sendWelcomeEmail = async (
  user: OnboardingUserInput
): Promise<void> => {
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
