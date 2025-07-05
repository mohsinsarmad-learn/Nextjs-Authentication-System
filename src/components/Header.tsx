// src/components/Header.tsx
"use client"; // This is now a client component

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import UserNav from "./UserNav";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Helper function to render the correct links when logged out
  const renderLoggedOutLinks = () => {
    // Case 1: On User login/register pages
    if (
      pathname.startsWith("/login/user") ||
      pathname.startsWith("/register/user") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password")
    ) {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link href="/login/user">Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/register/user">Register</Link>
          </Button>
        </>
      );
    }
    // Case 2: On Admin login/register pages
    if (
      pathname.startsWith("/login/admin") ||
      pathname.startsWith("/register/admin") ||
      pathname.startsWith("/forgot-password/admin") ||
      pathname.startsWith("/reset-password/admin")
    ) {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link href="/login/admin">Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/register/admin">Register</Link>
          </Button>
        </>
      );
    }
    // Case 3: On the Homepage ('/') or any other page
    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/login/user">User</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/login/admin">Admin</Link>
        </Button>
      </>
    );
  };

  return (
    <header className="py-4 px-6 border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Project D1
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            // If logged in, show the UserNav dropdown
            <UserNav />
          ) : (
            // If logged out, show the context-aware links
            renderLoggedOutLinks()
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
