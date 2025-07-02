// src/components/Header.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "./SignOutButton";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle"; // Import ThemeToggle

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="py-4 px-6 border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Project D1
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle /> {/* Add the ThemeToggle here */}
          {session ? (
            <>
              <span className="text-sm hidden sm:inline">
                Welcome, {session.user?.name}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Button asChild>
              <Link href="/login/user">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
