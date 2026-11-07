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

export interface AddBirthdayPromptEmailProps {
  name?: string;
  profileUrl?: string;
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

const reminderCard = {
  backgroundColor: "#fafafa",
  border: "1px solid #eeeeee",
  margin: "20px 0",
  padding: "16px",
};

const reminderTitle = {
  color: "#111111",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const reminderText = {
  color: "#444444",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
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

export const AddBirthdayPromptEmail = ({
  name = "there",
  profileUrl = "https://www.befday.com/profile",
}: AddBirthdayPromptEmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>one quick step — add your birthday on befday</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>don&apos;t miss your birthday treats.</Heading>

        <Text style={paragraph}>
          hi {name}, we noticed you haven&apos;t added your birthday to your
          befday profile yet.
        </Text>

        <Text style={paragraph}>
          many popular brands (like starbucks, boost juice, and sephora) require
          you to register for their loyalty programs at least 30 days before
          your birthday to qualify for complimentary drinks and gifts.
        </Text>

        <div style={reminderCard}>
          <Text style={reminderTitle}>why add your birthday?</Text>
          <Text style={reminderText}>
            • we&apos;ll send your personalized perks guide on the 1st of your
            birth month
            <br />• get early notifications so you have time to sign up for
            brand memberships
            <br />• completely private and only used to send your birthday perks
          </Text>
        </div>

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
                  <Link href={profileUrl} style={buttonLink}>
                    add your birthday
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Text style={paragraph}>
          it takes less than 10 seconds to add your date of birth.
        </Text>

        <Text style={signoff}>— the befday team</Text>

        <Hr style={hr} />

        <Text style={footer}>
          sent by befday. you received this email because you created an account
          on{" "}
          <Link href="https://www.befday.com" style={footerLink}>
            befday.com
          </Link>
          . you can update your notification preferences at any time.
        </Text>
      </Container>
    </Body>
  </Html>
);

AddBirthdayPromptEmail.PreviewProps = {
  name: "alex",
  profileUrl: "https://www.befday.com/profile",
} satisfies AddBirthdayPromptEmailProps;

export default AddBirthdayPromptEmail;
