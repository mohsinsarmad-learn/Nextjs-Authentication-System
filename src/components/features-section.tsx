"use client"

import { motion } from "framer-motion"
import { UserCheck, Shield, Users, Mail, Lock, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Complete Authentication Flow",
    description: "Full registration and login system with email verification and secure token management",
    icon: UserCheck,
    color: "text-primary",
    bgColor: "bg-primary/10",
    features: ["Email verification", "Secure password hashing", "Token-based authentication", "Session management"],
  },
  {
    title: "Role-Based Access Control",
    description: "Admin and user roles with different dashboard experiences and permissions",
    icon: Shield,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    features: ["Admin dashboard", "User dashboard", "Permission management", "Route protection"],
  },
  {
    title: "User Management",
    description: "Comprehensive user profile management with photo uploads and data editing",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10",
    features: ["Profile photo upload", "Profile editing", "Password reset", "Account management"],
  },
  {
    title: "CRUD Operations",
    description: "Full create, read, update, and delete operations for both admin and regular users",
    icon: Database,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    features: ["User data management", "Admin user control", "Secure data operations", "Real-time updates"],
  },
  {
    title: "Email Integration",
    description: "Automated email system for verification, password reset, and notifications",
    icon: Mail,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    features: ["Email verification", "Password reset emails", "Beautiful templates", "Token validation"],
  },
  {
    title: "Security Features",
    description: "Enterprise-grade security with validation, encryption, and session protection",
    icon: Lock,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    features: ["Client-side validation", "Server-side validation", "Secure sessions", "Protected routes"],
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Comprehensive Features</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need for a complete authentication and user management system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
