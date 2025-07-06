"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import UserNav from "./UserNav";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import {
  Menu,
  LogIn,
  UserPlus,
  User,
  Shield,
  LayoutDashboard,
  DoorClosed,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getNavLinks = () => {
    let basePath = "";
    if (
      pathname.startsWith("/login/user") ||
      pathname.startsWith("/register/user") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password")
    ) {
      basePath = "/user";
    } else if (
      pathname.startsWith("/login/admin") ||
      pathname.startsWith("/register/admin") ||
      pathname.startsWith("/forgot-password/admin") ||
      pathname.startsWith("/reset-password/admin")
    ) {
      basePath = "/admin";
    }

    if (basePath) {
      return [
        {
          href: `/login${basePath}`,
          label: "Login",
          icon: <LogIn className="h-5 w-5" />,
        },
        {
          href: `/register${basePath}`,
          label: "Register",
          icon: <UserPlus className="h-5 w-5" />,
        },
      ];
    }

    return [
      {
        href: "/login/user",
        label: "User Login",
        icon: <User className="h-5 w-5" />,
      },
      {
        href: "/login/admin",
        label: "Admin Login",
        icon: <Shield className="h-5 w-5" />,
      },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="py-4 px-4 sm:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
    >
      {" "}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Project D1
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {session ? (
            <UserNav />
          ) : (
            navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))
          )}
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left text-xl">Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full">
                {session ? (
                  <>
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={session.user.image || ""} />
                          <AvatarFallback>
                            {session.user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {session.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {session.user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <nav className="flex flex-col gap-1 p-2 text-lg font-medium">
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                          <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </Link>
                      </SheetClose>
                    </nav>
                    <div className="mt-auto p-2 border-t">
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-lg p-6"
                          onClick={() => signOut({ callbackUrl: "/" })}
                        >
                          <DoorClosed className="mr-3 h-5 w-5" /> Sign Out
                        </Button>
                      </SheetClose>
                    </div>
                  </>
                ) : (
                  <nav className="flex flex-col gap-1 p-2 text-lg font-medium">
                    {navLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                          {link.icon} {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                )}
              </div>

              <SheetFooter className="p-4 border-t">
                <p className="text-xs text-muted-foreground text-center w-full">
                  © {new Date().getFullYear()} Project D1
                </p>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
