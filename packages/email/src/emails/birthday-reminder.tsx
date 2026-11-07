import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface BirthdayReminderEmailProps {
  name?: string;
  daysRemaining?: number;
  perksUrl?: string;
  featuredPerks?: string[];
}

const main = {
  backgroundColor: "#f9f9f9",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: "0",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};

const heading = {
  color: "#111111",
  fontSize: "22px",
  fontWeight: "600" as const,
  letterSpacing: "-0.3px",
  lineHeight: "30px",
  margin: "0 0 20px",
};

const paragraph = {
  color: "#444444",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const perksCard = {
  backgroundColor: "#fafafa",
  border: "1px solid #eeeeee",
  margin: "20px 0",
  padding: "16px",
};

const perksHeader = {
  color: "#111111",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const perkItem = {
  color: "#444444",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
};

const buttonContainer = {
  margin: "28px 0",
};

const buttonTableCell = {
  backgroundColor: "#111111",
};

const buttonLink = {
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "500" as const,
  lineHeight: "100%",
  padding: "12px 24px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const signoff = {
  color: "#444444",
  fontSize: "15px",
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "24px",
};

const hr = {
  border: "none",
  borderTop: "1px solid #eaeaea",
  margin: "24px 0",
};

const footer = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
};

const footerLink = {
  color: "#888888",
  textDecoration: "underline",
};

export const BirthdayReminderEmail = ({
  name,
  daysRemaining = 7,
  perksUrl = "https://www.befday.com",
  featuredPerks,
}: BirthdayReminderEmailProps) => {
  const isBirthdayToday = daysRemaining === 0;

  const previewText = isBirthdayToday
    ? "happy birthday from befday! 🎂 your birthday perks are ready"
    : `your birthday is in ${daysRemaining} days — get your perks ready`;

  const birthdayGreeting = name
    ? `happy birthday, ${name}!`
    : "happy birthday!";

  const headingText = isBirthdayToday
    ? birthdayGreeting
    : `your birthday is in ${daysRemaining} days.`;

  const buttonText = isBirthdayToday
    ? "claim your perks"
    : "view all birthday perks";

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{headingText}</Heading>

          {isBirthdayToday ? (
            <Text style={paragraph}>
              wishing you a fantastic birthday filled with celebration and
              treats! today is your day, and all your birthday perks are
              unlocked and ready to be claimed.
            </Text>
          ) : (
            <Text style={paragraph}>
              {name
                ? `hi ${name}, your birthday is just around the corner. many brands require signing up as a member or downloading their app before your birthday to qualify for their perks.`
                : "your birthday is just around the corner. many brands require signing up as a member or downloading their app before your birthday to qualify for their perks."}
            </Text>
          )}

          {featuredPerks && featuredPerks.length > 0 && (
            <div style={perksCard}>
              <Text style={perksHeader}>popular perks to check out:</Text>
              {featuredPerks.map((perk, index) => (
                <Text key={index} style={perkItem}>
                  • {perk}
                </Text>
              ))}
            </div>
          )}

          <Section style={buttonContainer}>
            <table
              align="left"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
            >
              <tbody>
                <tr>
                  <td align="center" style={buttonTableCell}>
                    <Link href={perksUrl} style={buttonLink}>
                      {buttonText}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Text style={paragraph}>
            be sure to check each perk&apos;s redemption terms, app
            requirements, and validity dates so you don&apos;t miss out.
          </Text>

          <Text style={signoff}>— the befday team</Text>

          <Hr style={hr} />

          <Text style={footer}>
            sent by befday. you received this reminder based on your birthday
            settings on{" "}
            <Link href="https://www.befday.com" style={footerLink}>
              befday.com
            </Link>
            . you can update your notifications in your account settings at any
            time.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

BirthdayReminderEmail.PreviewProps = {
  daysRemaining: 7,
  featuredPerks: [
    "starbucks — complimentary handcrafted beverage",
    "boost juice — free birthday smoothie",
    "sephora — exclusive birthday gift set",
  ],
  name: "alex",
  perksUrl: "https://www.befday.com",
} satisfies BirthdayReminderEmailProps;

export default BirthdayReminderEmail;
