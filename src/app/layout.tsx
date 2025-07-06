import type { Metadata } from "next";
import { Inter, Lora, Inconsolata } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/PageTransition";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/components/NextAuthProvider";
import { cn } from "@/lib/utils";
import { FontProvider } from "@/components/FontProvider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Inconsolata({
  subsets: ["latin"],
  variable: "--font-mono",
});
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable
        )}
      >
        <FontProvider>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <main>
                <PageTransition>{children}</PageTransition>
              </main>
              <Toaster richColors />
            </ThemeProvider>
          </NextAuthProvider>
        </FontProvider>
      </body>
    </html>
  );
}
