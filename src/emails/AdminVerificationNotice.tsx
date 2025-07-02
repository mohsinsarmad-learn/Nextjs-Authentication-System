// emails/AdminVerificationNotice.tsx
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

interface AdminVerificationNoticeProps {
  verificationLink: string;
  newAdminEmail: string;
}

export const AdminVerificationNotice = ({
  verificationLink = "https://example.com",
  newAdminEmail = "admin@example.com",
}: AdminVerificationNoticeProps) => (
  <Html>
    <Head />
    <Preview>New Admin Account Verification Required</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Attention IT Department,</Text>
        <Text style={paragraph}>
          A new admin account has been registered with the email:{" "}
          <strong>{newAdminEmail}</strong>.
        </Text>
        <Text style={paragraph}>
          Please verify this registration by clicking the button below. If this
          was not expected, please ignore this email.
        </Text>
        <Button style={button} href={verificationLink}>
          Verify New Admin Account
        </Button>
        <Text style={paragraph}>
          This verification link is valid for 24 hours.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AdminVerificationNotice;

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
