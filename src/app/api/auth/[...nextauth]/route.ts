// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import Admin from "@/models/Admin";

export const authOptions: AuthOptions = {
  providers: [
    // ... your credentials providers for user and admin remain exactly the same ...
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
            throw new Error("Please verify your email before logging in.");
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

  // --- THIS SECTION CONTAINS THE CORRECTED LOGIC ---
  callbacks: {
    async jwt({ token, user, trigger }) {
      // 1. On initial sign-in, the `user` object is passed.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
      }

      // 2. The `update` trigger runs when the client calls `useSession().update()`.
      //    We now force a re-fetch of the data from the database.
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
      // This callback ensures the session object on the client reflects the token.
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
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
