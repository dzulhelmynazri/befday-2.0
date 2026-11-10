import { RetryableError, getStepMetadata } from "workflow";

import { log } from "@/lib/evlog";
import { email } from "@/services";

export const FROM_ADDRESS = "befday <hello@befday.com>";

export const getRetryAfterMs = (attempt: number): number =>
  Math.min(2 ** attempt * 2000, 60_000);

export const sendEmailWithRetry = async (input: {
  readonly context: Record<string, string>;
  readonly event: string;
  readonly html: string;
  readonly subject: string;
  readonly text: string;
  readonly to: string;
}): Promise<void> => {
  const { attempt } = getStepMetadata();

  try {
    await email.send({
      from: FROM_ADDRESS,
      html: input.html,
      subject: input.subject,
      text: input.text,
      to: input.to,
    });
  } catch (error) {
    log.error({
      ...input.context,
      error,
      event: input.event,
    });

    throw new RetryableError("Failed to deliver email", {
      retryAfter: getRetryAfterMs(attempt),
    });
  }
};
