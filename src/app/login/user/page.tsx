// src/app/login/user/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { userLoginSchema } from "@/schemas/frontend/user/authSchemas";

export default function UserLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userLoginSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      // Let next-auth handle the redirect. This is the most reliable method.
      const result = await signIn("credentials-user", {
        email: values.email,
        password: values.password,
        // Tell next-auth where to redirect on success.
        callbackUrl: "/dashboard",
      });

      // If signIn fails, it will return an error object instead of redirecting.
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      // This is for unexpected errors (e.g., network failure).
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 text-sm">
          <div className="flex justify-between w-full">
            <Link
              href="/register/user"
              className="text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              Don't have an account? Sign Up
            </Link>
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
