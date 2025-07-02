// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/PageTransition";
import Header from "@/components/Header"; // Import the new Header
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/components/NextAuthProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web Application Project",
  description: "D1 Evaluation Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header /> {/* Use the new dynamic Header */}
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
            <Toaster richColors />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
