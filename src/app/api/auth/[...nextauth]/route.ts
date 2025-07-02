// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Import your custom database connection and models
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import Admin from "@/models/Admin";

export const authOptions: AuthOptions = {
  providers: [
    // We define two separate CredentialsProviders, one for users and one for admins.
    // The `id` is crucial for differentiating them on the front end.
    CredentialsProvider({
      id: "credentials-user", // Unique ID for the user login flow
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
          // On successful authentication, we return the user object.
          // We add a 'role' property to easily identify them throughout the app.
          return {
            id: user.UserId,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
            image: user.profilepic,
            role: "User", // Custom property
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),

    CredentialsProvider({
      id: "credentials-admin", // Unique ID for the admin login flow
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
          return {
            id: admin.AdminId,
            email: admin.email,
            name: `${admin.firstname} ${admin.lastname}`,
            image: admin.profilepic,
            role: "Admin", // Custom property
          };
        }
        return null;
      },
    }),
  ],

  // Callbacks are essential for adding our custom `role` to the session token
  callbacks: {
    async jwt({ token, user }) {
      // When the user logs in, the `user` object from `authorize` is passed here.
      if (user) {
        token.role = user.role; // Add the role to the JWT token
        token.id = user.id; // Add the custom ID to the token
      }
      return token;
    },
    async session({ session, token }) {
      // This makes the role available on the client-side session object
      if (session.user) {
        session.user.role = token.role; // Pass role from token to session
        session.user.id = token.id; // Pass ID from token to session
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // We will create these pages in the next phase.
    // Auth.js will redirect to these pages.
    signIn: "/login/user",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
