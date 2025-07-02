// emails/PasswordResetEmail.tsx
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

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail = ({
  resetLink = "https://example.com",
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset Your Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi there,</Text>
        <Text style={paragraph}>
          Someone requested a password reset for your account. If this was you,
          please click the button below to set a new password.
        </Text>
        <Button style={button} href={resetLink}>
          Reset Password
        </Button>
        <Text style={paragraph}>
          This link is valid for 24 hours. If you did not request a password
          reset, please ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

// --- Basic Styles ---
const main = { backgroundColor: "#ffffff", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "20px 0 48px" };
const paragraph = { fontSize: "16px", lineHeight: "26px" };
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
