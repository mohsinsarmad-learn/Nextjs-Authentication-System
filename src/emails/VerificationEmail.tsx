import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username?: string;
  verificationLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const VerificationEmail = ({
  username = "User",
  verificationLink = `${baseUrl}/verify-email?token=mock-token`,
}: VerificationEmailProps) => {
  const previewText = `Hi ${username}, verify your email for Project D1.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="120"
              height="30"
              alt="Project Logo"
            />
          </Section>
          <Section style={card}>
            <Heading style={h1}>Confirm Your Email Address</Heading>
            <Text style={text}>Hi {username},</Text>
            <Text style={text}>
              Thanks for signing up for Project D1. We're excited to have you on
              board. Please click the button below to complete your
              registration.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={verificationLink}>
                Verify My Email
              </Button>
            </Section>
            <Text style={text}>
              This verification link is valid for the next 24 hours.
            </Text>
            <Hr style={hr} />
            <Section style={{ textAlign: "center" }}>
              <Text style={text}>
                Alternatively, scan the QR code below with your phone.
              </Text>
              <Img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${verificationLink}`}
                width="150"
                height="150"
                alt="Verification QR Code"
                style={{ margin: "20px auto" }}
              />
            </Section>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              This email was intended for{" "}
              <span style={{ color: "#e2e8f0" }}>{username}</span>. If you were
              not expecting this email, you can ignore it.
            </Text>
            <Row>
              <Column
                align="right"
                style={{ width: "50%", paddingRight: "8px" }}
              >
                <Link href="https://github.com/mohsinsarmad-learn">
                  <Img src={`${baseUrl}/github.png`} width="24" height="24" />
                </Link>
              </Column>
              <Column align="left" style={{ width: "50%", paddingLeft: "8px" }}>
                <Link href="https://x.com/mohsin__sarmad">
                  <Img src={`${baseUrl}/x.png`} width="24" height="24" />
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

// --- Styles ---
const main = {
  backgroundColor: "#0f172a", // Main background
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const logoContainer = {
  padding: "20px 0",
};

const card = {
  backgroundColor: "#1e293b", // Card background, slightly lighter
  borderRadius: "8px",
  padding: "32px",
  border: "1px solid #334155",
};

const h1 = {
  color: "#e2e8f0",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 30px",
};

const text = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  padding: "14px 24px",
};

const hr = {
  borderColor: "#334155",
  margin: "28px 0",
};

const footer = {
  padding: "20px 0",
};

const footerText = {
  color: "#64748b",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "24px",
};
