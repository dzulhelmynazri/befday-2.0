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

export interface BirthMonthKickoffEmailProps {
  name?: string;
  monthName?: string;
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

export const BirthMonthKickoffEmail = ({
  name,
  monthName = "this month",
  perksUrl = "https://www.befday.com",
  featuredPerks,
}: BirthMonthKickoffEmailProps) => {
  const headingText = name
    ? `it's your birth month, ${name}.`
    : "it's your birth month.";

  return (
    <Html lang="en">
      <Head />
      <Preview>happy birth month! 🎂 your {monthName} perks guide</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{headingText}</Heading>

        <Text style={paragraph}>
          welcome to your birthday month! throughout {monthName}, dozens of
          brands offer free drinks, complimentary desserts, dining discounts,
          and exclusive rewards.
        </Text>

        <Text style={paragraph}>
          many popular perks are valid across your entire birth month, but some
          require joining membership apps ahead of time. check your guide early
          to make sure you don&apos;t miss out.
        </Text>

        {featuredPerks && featuredPerks.length > 0 && (
          <div style={perksCard}>
            <Text style={perksHeader}>popular {monthName} perks:</Text>
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
                    view {monthName} perks
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Text style={paragraph}>
          be sure to check each perk&apos;s validity dates and redemption terms
          before heading in-store.
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

BirthMonthKickoffEmail.PreviewProps = {
  featuredPerks: [
    "starbucks — complimentary handcrafted beverage",
    "boost juice — free birthday smoothie",
    "sephora — exclusive birthday gift set",
  ],
  monthName: "november",
  name: "alex",
  perksUrl: "https://www.befday.com",
} satisfies BirthMonthKickoffEmailProps;

export default BirthMonthKickoffEmail;
