import { sleep } from "workflow";

import type { OnboardingResult } from "./steps/send-birthday-prompt-if-missing";
import { sendBirthdayPromptIfMissing } from "./steps/send-birthday-prompt-if-missing";
import type { OnboardingUserInput } from "./steps/send-welcome-email";
import { sendWelcomeEmail } from "./steps/send-welcome-email";

/** Started from the Better Auth user creation hook in auth.ts. */
export const userOnboardingWorkflow = async (
  user: OnboardingUserInput
): Promise<OnboardingResult> => {
  "use workflow";

  await sendWelcomeEmail(user);
  await sleep("3d");

  return sendBirthdayPromptIfMissing(user.id);
};
