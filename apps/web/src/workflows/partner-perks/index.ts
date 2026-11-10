import { sendPartnerApprovedEmail } from "./steps/send-partner-approved-email";
import { sendSubmissionReceivedEmail } from "./steps/send-submission-received-email";
import { sendSubmissionTelegram } from "./steps/send-submission-telegram";

/** Started from partnerRouter.submit via context.ts. */
export const partnerSubmittedWorkflow = async (
  perkId: string
): Promise<void> => {
  "use workflow";

  await Promise.all([
    sendSubmissionTelegram(perkId),
    sendSubmissionReceivedEmail(perkId),
  ]);
};

/** Started from /api/perks/approve when publishing a perk with contact details. */
export const partnerApprovedWorkflow = async (
  perkId: string
): Promise<void> => {
  "use workflow";

  await sendPartnerApprovedEmail(perkId);
};
