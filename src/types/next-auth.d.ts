// src/types/next-auth.d.ts

import NextAuth, { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type to include our custom properties.
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]; // Keep the original properties
  }

  /**
   * Extends the built-in User type.
   */
  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  /** Extends the built-in JWT type. */
  interface JWT {
    role: string;
    id: string;
  }
}
