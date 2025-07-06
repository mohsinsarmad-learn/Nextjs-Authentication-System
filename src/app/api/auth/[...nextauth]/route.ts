import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import { Resend } from "resend";

import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import Admin from "@/models/Admin";
import { VerificationEmail } from "@/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials-user",
      name: "User Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (user && (await user.comparePassword(credentials.password))) {
          if (!user.isVerified) {
            const newVerificationToken = crypto.randomBytes(32).toString("hex");
            const newVerificationTokenExpires = new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ); // 24 hours

            user.verificationToken = newVerificationToken;
            user.verificationTokenExpires = newVerificationTokenExpires;
            await user.save();

            const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${newVerificationToken}&type=user`;
            const from = process.env.EMAIL_FROM!;
            try {
              await resend.emails.send({
                from: from,
                to: user.email,
                subject: "Verify Your Email Address (New Link)",
                react: VerificationEmail({ verificationLink }),
              });
            } catch (emailError) {
              console.error("Resend verification email error:", emailError);
              throw new Error(
                "Verification email could not be sent. Please try again later."
              );
            }

            throw new Error(
              "Email not verified. A new verification link has been sent to your email address."
            );
          }
          return {
            id: user.UserId,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
            image: user.profilepic,
            role: "User",
          };
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "credentials-admin",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await connectToDatabase();
        const admin = await Admin.findOne({ email: credentials.email });
        if (admin && (await admin.comparePassword(credentials.password))) {
          if (!admin.isVerified) {
            throw new Error(
              "This admin account has not been verified by the IT department."
            );
          }
          return {
            id: admin.AdminId,
            email: admin.email,
            name: `${admin.firstname} ${admin.lastname}`,
            image: admin.profilepic,
            role: "Admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
      }
      if (trigger === "update") {
        await connectToDatabase();
        if (token.role === "User") {
          const freshUser = await User.findOne({ UserId: token.id });
          if (freshUser) {
            token.name = `${freshUser.firstname} ${freshUser.lastname}`;
            token.image = freshUser.profilepic;
          }
        } else if (token.role === "Admin") {
          const freshAdmin = await Admin.findOne({ AdminId: token.id });
          if (freshAdmin) {
            token.name = `${freshAdmin.firstname} ${freshAdmin.lastname}`;
            token.image = freshAdmin.profilepic;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.image = token.image as string | null | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login/user",
    error: "/login/user",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
