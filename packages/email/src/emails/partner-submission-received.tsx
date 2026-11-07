import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

export interface PartnerSubmissionReceivedEmailProps {
  contactName?: string;
  brandName?: string;
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

const statusCard = {
  backgroundColor: "#fafafa",
  border: "1px solid #eeeeee",
  margin: "20px 0",
  padding: "16px",
};

const statusLabel = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const statusValue = {
  color: "#111111",
  fontSize: "15px",
  fontWeight: "600" as const,
  margin: "0",
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

export const PartnerSubmissionReceivedEmail = ({
  contactName = "there",
  brandName = "your brand",
}: PartnerSubmissionReceivedEmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>we received your submission for {brandName} on befday</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>we received your submission.</Heading>

        <Text style={paragraph}>
          hi {contactName}, thank you for submitting a birthday perk for{" "}
          {brandName} on befday.
        </Text>

        <Text style={paragraph}>
          our editorial team verifies every submission against official brand
          announcements, membership requirements, and terms to ensure all
          listings on befday are 100% accurate for our community.
        </Text>

        <div style={statusCard}>
          <Text style={statusLabel}>submitted brand</Text>
          <Text style={statusValue}>{brandName}</Text>
          <Text style={{ ...statusLabel, marginTop: "12px" }}>
            current status
          </Text>
          <Text style={statusValue}>under review (24–48 hours)</Text>
        </div>

        <Text style={paragraph}>
          we typically review submissions within 24 to 48 hours. as soon as your
          listing is approved and published live in our directory, we will send
          you a confirmation email with your listing link.
        </Text>

        <Text style={paragraph}>
          if you have any questions or need to make immediate changes to your
          submission, simply reply to this email or write to{" "}
          <Link href="mailto:hello@befday.com" style={footerLink}>
            hello@befday.com
          </Link>
          .
        </Text>

        <Text style={signoff}>— the befday team</Text>

        <Hr style={hr} />

        <Text style={footer}>
          sent by befday. you received this automated update regarding your
          partner submission on{" "}
          <Link href="https://www.befday.com" style={footerLink}>
            befday.com
          </Link>
          .
        </Text>
      </Container>
    </Body>
  </Html>
);

PartnerSubmissionReceivedEmail.PreviewProps = {
  brandName: "kopi lab",
  contactName: "sarah",
} satisfies PartnerSubmissionReceivedEmailProps;

export default PartnerSubmissionReceivedEmail;
