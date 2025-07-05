// src/components/Header.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import UserNav from "./UserNav"; // Import our new component

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="py-4 px-6 border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Project D1
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            // If a session exists, render the UserNav component
            <UserNav />
          ) : (
            // Otherwise, show the sign-in button
            <Button asChild>
              <Link href="/login/user">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
