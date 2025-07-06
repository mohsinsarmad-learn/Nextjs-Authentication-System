"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Mail,
  Shield,
  Palette,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const technologies = [
  {
    category: "Framework & Core",
    icon: Code2,
    color: "text-primary",
    bgColor: "bg-primary/10",
    items: [
      {
        name: "Next.js 15",
        description: "Latest React framework with App Router",
      },
      { name: "TypeScript", description: "Type-safe development" },
      {
        name: "React 19",
        description: "Modern React with concurrent features",
      },
    ],
  },
  {
    category: "UI & Styling",
    icon: Palette,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    items: [
      { name: "ShadCN/UI", description: "Beautiful, accessible components" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      {
        name: "Framer Motion",
        description: "Smooth animations and transitions",
      },
      { name: "Lucide React", description: "Beautiful, customizable icons" },
    ],
  },
  {
    category: "Authentication & Security",
    icon: Shield,
    color: "text-accent",
    bgColor: "bg-accent/10",
    items: [
      { name: "Auth.js", description: "Secure authentication solution" },
      { name: "Zod", description: "TypeScript-first schema validation" },
      { name: "JWT Tokens", description: "Secure session management" },
    ],
  },
  {
    category: "Database & Storage",
    icon: Database,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    items: [
      { name: "MongoDB", description: "NoSQL database for scalability" },
      { name: "Mongoose", description: "Elegant MongoDB object modeling" },
      { name: "ImageKit", description: "Image optimization and storage" },
    ],
  },
  {
    category: "Communication",
    icon: Mail,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    items: [
      { name: "Resend", description: "Modern email delivery service" },
      { name: "React Email", description: "Beautiful email templates" },
      {
        name: "Email Verification",
        description: "Secure token-based verification",
      },
    ],
  },
  {
    category: "Developer Experience",
    icon: Zap,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    items: [
      { name: "Next Themes", description: "Dark/Light mode support" },
      { name: "Custom Color Scheme", description: "OKLCH color system" },
      { name: "Hot Reload", description: "Fast development workflow" },
    ],
  },
];

export function TechnologiesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built with Modern Technologies
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Leveraging the latest and most reliable technologies to deliver a
            robust authentication system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${tech.bgColor} flex items-center justify-center mb-4`}
                  >
                    <tech.icon className={`h-6 w-6 ${tech.color}`} />
                  </div>
                  <CardTitle className="text-xl">{tech.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tech.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
