// emails/VerificationEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  verificationLink?: string;
}

export const VerificationEmail = ({
  verificationLink = "https://example.com",
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Email Verification</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi there,</Text>
        <Text style={paragraph}>
          Welcome! Please click the button below to verify your email address
          and complete your registration.
        </Text>
        <Button style={button} href={verificationLink}>
          Verify Email
        </Button>
        <Text style={paragraph}>
          This link is valid for 24 hours. If you did not request this, please
          ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
