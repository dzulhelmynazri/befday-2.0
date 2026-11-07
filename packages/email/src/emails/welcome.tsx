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

export interface WelcomeEmailProps {
  name?: string;
  perksUrl?: string;
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

export const WelcomeEmail = ({
  name = "there",
  perksUrl = "https://www.befday.com",
}: WelcomeEmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>welcome to befday — your birthday perks are waiting</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>welcome to befday.</Heading>

        <Text style={paragraph}>hi {name}, thanks for joining befday.</Text>

        <Text style={paragraph}>
          we curate free treats, special discounts, and exclusive rewards from
          top brands so you can celebrate your special day without missing out
          on any gifts.
        </Text>

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
                    explore birthday perks
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Text style={paragraph}>
          browse through dozens of categories including dining, coffee,
          desserts, shopping, and entertainment. each perk includes clear
          redemption instructions and validity periods.
        </Text>

        <Text style={signoff}>— the befday team</Text>

        <Hr style={hr} />

        <Text style={footer}>
          sent by befday. you received this email because you signed up on{" "}
          <Link href="https://www.befday.com" style={footerLink}>
            befday.com
          </Link>
          . if you didn&apos;t create an account, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  name: "alex",
  perksUrl: "https://www.befday.com",
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
