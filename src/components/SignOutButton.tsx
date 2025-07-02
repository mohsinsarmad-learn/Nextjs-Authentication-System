// src/components/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        signOut({
          // After signing out, redirect to the homepage
          callbackUrl: "/",
        })
      }
    >
      <LogOut className="h-5 w-5" />
      <span className="sr-only">Sign Out</span>
    </Button>
  );
}
