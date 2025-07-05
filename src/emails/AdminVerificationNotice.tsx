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
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AdminVerificationNoticeProps {
  newAdminName?: string;
  newAdminEmail?: string;
  verificationLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const AdminVerificationNotice = ({
  newAdminName = "New Admin",
  newAdminEmail = "admin@example.com",
  verificationLink = `${baseUrl}/verify-email?token=mock-token`,
}: AdminVerificationNoticeProps) => {
  const previewText = `Approve new admin account for ${newAdminName}`;

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
            <Heading style={h1}>Admin Account Approval Required</Heading>
            <Text style={text}>Hello IT Department,</Text>
            <Text style={text}>
              A new admin account has been registered and requires your
              approval. Please review the details below and click the button to
              verify and activate the account.
            </Text>
            <Hr style={hr} />
            <Section>
              <Row>
                <Column style={detailsLabel}>New Admin Name:</Column>
                <Column style={detailsValue}>{newAdminName}</Column>
              </Row>
              <Row>
                <Column style={detailsLabel}>New Admin Email:</Column>
                <Column style={detailsValue}>{newAdminEmail}</Column>
              </Row>
            </Section>
            <Hr style={hr} />
            <Section style={buttonContainer}>
              <Button style={button} href={verificationLink}>
                Approve & Verify Account
              </Button>
            </Section>
            <Text style={text}>
              This verification link is valid for the next 24 hours. If this
              request was unexpected, please take appropriate security measures.
            </Text>
            <Section style={{ textAlign: "center" }}>
              <Text style={text}>
                Alternatively, scan the QR code below with your phone to
                approve.
              </Text>
              <Img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${verificationLink}`}
                width="150"
                height="150"
                alt="Admin Verification QR Code"
                style={{ margin: "20px auto" }}
              />
            </Section>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from Project D1.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminVerificationNotice;

const main = {
  backgroundColor: "#0f172a",
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
  backgroundColor: "#1e293b",
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
  backgroundColor: "#f59e0b",
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

const detailsLabel = {
  ...text,
  color: "#cbd5e1",
  width: "40%",
};

const detailsValue = {
  ...text,
  fontWeight: "bold",
  color: "#e2e8f0",
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
