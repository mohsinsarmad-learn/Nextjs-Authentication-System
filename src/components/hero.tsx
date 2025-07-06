"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/10">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent-foreground mb-6">
              <Star className="mr-2 h-4 w-4" />
              Built with Next.js 15 & Modern Stack
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Complete Authentication
              <span className="block text-primary">System</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground mb-10"
          >
            A full-featured authentication system built with Next.js 15,
            featuring user registration, email verification, role-based access
            control, and comprehensive dashboard management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="group" asChild>
              <Link href="/dashboard">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/mohsinsarmad-learn/Nextjs-Authentication-System">
                <Github className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
    </section>
  );
}
