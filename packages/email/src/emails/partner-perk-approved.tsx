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

export interface PartnerPerkApprovedEmailProps {
  brandName: string;
  contactName: string;
  listingUrl: string;
  perkHeadline: string;
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

const listingCard = {
  backgroundColor: "#fafafa",
  border: "1px solid #eeeeee",
  margin: "20px 0",
  padding: "16px",
};

const cardLabel = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const cardValue = {
  color: "#111111",
  fontSize: "15px",
  fontWeight: "600" as const,
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

export const PartnerPerkApprovedEmail = ({
  brandName,
  contactName,
  listingUrl,
  perkHeadline,
}: PartnerPerkApprovedEmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>your birthday perk for {brandName} is now live on befday</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>your perk is live on befday.</Heading>

        <Text style={paragraph}>
          hi {contactName}, your birthday perk for {brandName} is now live on
          befday.
        </Text>

        <Text style={paragraph}>
          people checking befday for birthday treats can now find your perk and
          see how to redeem it.
        </Text>

        <div style={listingCard}>
          <Text style={cardLabel}>published listing</Text>
          <Text style={cardValue}>{brandName}</Text>
          {perkHeadline && (
            <>
              <Text style={{ ...cardLabel, marginTop: "12px" }}>
                approved perk
              </Text>
              <Text style={cardValue}>{perkHeadline}</Text>
            </>
          )}
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
                  <Link href={listingUrl} style={buttonLink}>
                    view your listing
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Text style={paragraph}>
          if you ever update terms, outlets, or redemption dates, reply directly
          or email us at{" "}
          <Link href="mailto:hello@befday.com" style={footerLink}>
            hello@befday.com
          </Link>
          .
        </Text>

        <Text style={signoff}>- the befday team</Text>

        <Hr style={hr} />

        <Text style={footer}>
          sent from befday.com in response to your partner submission.
        </Text>
      </Container>
    </Body>
  </Html>
);

PartnerPerkApprovedEmail.PreviewProps = {
  brandName: "kopi lab",
  contactName: "sarah",
  listingUrl: "https://www.befday.com/perks/kopi-lab",
  perkHeadline: "free slice of cake with any handcrafted beverage purchase",
} satisfies PartnerPerkApprovedEmailProps;

export default PartnerPerkApprovedEmail;
