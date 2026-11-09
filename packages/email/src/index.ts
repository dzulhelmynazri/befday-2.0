import { createEmailClient } from "@opencoredev/email-sdk";
import { cloudflare } from "@opencoredev/email-sdk/cloudflare";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { createElement } from "react";

import { AddBirthdayPromptEmail } from "./emails/add-birthday-prompt";
import type { AddBirthdayPromptEmailProps } from "./emails/add-birthday-prompt";
import { BirthMonthKickoffEmail } from "./emails/birth-month-kickoff";
import type { BirthMonthKickoffEmailProps } from "./emails/birth-month-kickoff";
import { BirthdayReminderEmail } from "./emails/birthday-reminder";
import type { BirthdayReminderEmailProps } from "./emails/birthday-reminder";
import { NewPerksDigestEmail } from "./emails/new-perks-digest";
import type { NewPerksDigestEmailProps } from "./emails/new-perks-digest";
import { PartnerOutreachEmail } from "./emails/partner-outreach";
import type { PartnerOutreachEmailProps } from "./emails/partner-outreach";
import { PartnerPerkApprovedEmail } from "./emails/partner-perk-approved";
import type { PartnerPerkApprovedEmailProps } from "./emails/partner-perk-approved";
import { PartnerSubmissionReceivedEmail } from "./emails/partner-submission-received";
import type { PartnerSubmissionReceivedEmailProps } from "./emails/partner-submission-received";
import { WelcomeEmail } from "./emails/welcome";
import type { WelcomeEmailProps } from "./emails/welcome";

export interface EmailConfig {
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}

export const createEmail = (env: EmailConfig) =>
  createEmailClient({
    adapters: [
      cloudflare({
        accountId: env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: env.CLOUDFLARE_API_TOKEN,
      }),
    ],
  });

export const renderEmail = async (element: ReactElement) => {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { html, text };
};

export const renderWelcomeEmail = (props: WelcomeEmailProps = {}) =>
  renderEmail(createElement(WelcomeEmail, props));

export const renderBirthdayReminderEmail = (
  props: BirthdayReminderEmailProps = {}
) => renderEmail(createElement(BirthdayReminderEmail, props));

export const renderBirthMonthKickoffEmail = (
  props: BirthMonthKickoffEmailProps = {}
) => renderEmail(createElement(BirthMonthKickoffEmail, props));

export const renderAddBirthdayPromptEmail = (
  props: AddBirthdayPromptEmailProps = {}
) => renderEmail(createElement(AddBirthdayPromptEmail, props));

export const renderPartnerSubmissionReceivedEmail = (
  props: PartnerSubmissionReceivedEmailProps
) => renderEmail(createElement(PartnerSubmissionReceivedEmail, props));

export const renderPartnerPerkApprovedEmail = (
  props: PartnerPerkApprovedEmailProps
) => renderEmail(createElement(PartnerPerkApprovedEmail, props));

export const renderNewPerksDigestEmail = (
  props: NewPerksDigestEmailProps = {}
) => renderEmail(createElement(NewPerksDigestEmail, props));

export const renderPartnerOutreachEmail = (props: PartnerOutreachEmailProps) =>
  renderEmail(createElement(PartnerOutreachEmail, props));

export { AddBirthdayPromptEmail } from "./emails/add-birthday-prompt";

export type { AddBirthdayPromptEmailProps } from "./emails/add-birthday-prompt";

export { BirthMonthKickoffEmail } from "./emails/birth-month-kickoff";

export type { BirthMonthKickoffEmailProps } from "./emails/birth-month-kickoff";

export { BirthdayReminderEmail } from "./emails/birthday-reminder";

export type { BirthdayReminderEmailProps } from "./emails/birthday-reminder";

export { NewPerksDigestEmail } from "./emails/new-perks-digest";

export type {
  NewPerkItem,
  NewPerksDigestEmailProps,
} from "./emails/new-perks-digest";

export { PartnerPerkApprovedEmail } from "./emails/partner-perk-approved";

export type { PartnerPerkApprovedEmailProps } from "./emails/partner-perk-approved";

export { PartnerOutreachEmail } from "./emails/partner-outreach";

export type { PartnerOutreachEmailProps } from "./emails/partner-outreach";

export { PartnerSubmissionReceivedEmail } from "./emails/partner-submission-received";

export type { PartnerSubmissionReceivedEmailProps } from "./emails/partner-submission-received";

export { WelcomeEmail } from "./emails/welcome";

export type { WelcomeEmailProps } from "./emails/welcome";

export type { EmailClient } from "@opencoredev/email-sdk";
