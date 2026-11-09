import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

export interface PartnerOutreachEmailProps {
  body: string;
  linkUrl: string;
  senderName: string;
}

const PARAGRAPH_BREAK = /\n\s*\n/u;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: "0",
  padding: "24px 0",
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  padding: "0 24px",
};

const paragraph = {
  color: "#222222",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const link = {
  color: "#222222",
  textDecoration: "underline",
};

const footer = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "32px 0 0",
};

export const PartnerOutreachEmail = ({
  body,
  linkUrl,
  senderName,
}: PartnerOutreachEmailProps) => {
  const paragraphs = body
    .split(PARAGRAPH_BREAK)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Preview>{paragraphs[0] ?? body}</Preview>
        <Container style={container}>
          {paragraphs.map((p) => (
            <Text key={p} style={paragraph}>
              {p}
            </Text>
          ))}

          <Text style={paragraph}>
            <Link href={linkUrl} style={link}>
              {linkUrl}
            </Link>
          </Text>

          <Text style={paragraph}>{senderName}</Text>

          <Text style={footer}>
            reply &quot;no thanks&quot; and we won&apos;t email you again.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

PartnerOutreachEmail.PreviewProps = {
  body: "saw zus coffee gives a free cake on your birthday month. we list it on befday, where people in malaysia check birthday treats before their month starts.\n\nyour listing pulls the redemption steps from your app page. want to check it's right, or add anything we missed?",
  linkUrl: "https://www.befday.com/perks/zus-coffee",
  senderName: "dzulhelmy, befday",
} satisfies PartnerOutreachEmailProps;

export default PartnerOutreachEmail;
