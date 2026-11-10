import type { Context } from "@befday-2.0/api/context";
import { start } from "workflow/api";

import { log } from "@/lib/evlog";
import { auth, getDb } from "@/services";
import { partnerSubmittedWorkflow } from "@/workflows/partner-perks";

export const startPartnerSubmissionWorkflow = async (
  perkId: string
): Promise<void> => {
  try {
    await start(partnerSubmittedWorkflow, [perkId]);
  } catch (error) {
    log.error({
      error,
      event: "partner.submission_workflow_start_failed",
      perkId,
    });
  }
};

export const createContext = async (headers: Headers): Promise<Context> => {
  const session = await auth.api.getSession({ headers });

  return {
    auth,
    db: getDb(),
    session,
    startPartnerSubmissionWorkflow,
  };
};
