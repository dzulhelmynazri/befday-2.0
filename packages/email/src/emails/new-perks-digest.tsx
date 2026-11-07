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

export interface NewPerkItem {
  brand: string;
  perk: string;
}

export interface NewPerksDigestEmailProps {
  name?: string;
  digestTitle?: string;
  perksUrl?: string;
  newPerks?: NewPerkItem[];
}

const DEFAULT_NEW_PERKS: NewPerkItem[] = [
  {
    brand: "ikea",
    perk: "complimentary birthday meal or signature dessert voucher",
  },
  {
    brand: "inside scoop",
    perk: "free single scoop of ice cream for club members",
  },
  {
    brand: "chagee",
    perk: "birthday tear-cup drink voucher via mobile app",
  },
];

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

const perksSection = {
  margin: "20px 0",
};

const perkCard = {
  backgroundColor: "#fafafa",
  border: "1px solid #eeeeee",
  margin: "0 0 10px",
  padding: "14px 16px",
};

const brandText = {
  color: "#111111",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 4px",
};

const perkDescText = {
  color: "#444444",
  fontSize: "14px",
  lineHeight: "20px",
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

export const NewPerksDigestEmail = ({
  name = "there",
  digestTitle = "new perks added this month",
  perksUrl = "https://www.befday.com",
  newPerks = DEFAULT_NEW_PERKS,
}: NewPerksDigestEmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>fresh birthday perks just added to befday</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>{digestTitle}.</Heading>

        <Text style={paragraph}>
          hi {name}, our editorial team just reviewed and added new verified
          birthday perks to the directory.
        </Text>

        <Text style={paragraph}>
          here are the latest free treats, dining vouchers, and complimentary
          gifts available for your next birthday:
        </Text>

        {newPerks && newPerks.length > 0 && (
          <div style={perksSection}>
            {newPerks.map((item, index) => (
              <div key={index} style={perkCard}>
                <Text style={brandText}>{item.brand}</Text>
                <Text style={perkDescText}>{item.perk}</Text>
              </div>
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
                    explore all perks
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Text style={paragraph}>
          remember to check redemption requirements early so you can register in
          time for your birth month.
        </Text>

        <Text style={signoff}>— the befday team</Text>

        <Hr style={hr} />

        <Text style={footer}>
          sent by befday. you received this digest as a registered member of{" "}
          <Link href="https://www.befday.com" style={footerLink}>
            befday.com
          </Link>
          . you can update your notification preferences in your account
          settings.
        </Text>
      </Container>
    </Body>
  </Html>
);

NewPerksDigestEmail.PreviewProps = {
  digestTitle: "new perks added this month",
  name: "alex",
  newPerks: DEFAULT_NEW_PERKS,
  perksUrl: "https://www.befday.com",
} satisfies NewPerksDigestEmailProps;

export default NewPerksDigestEmail;
