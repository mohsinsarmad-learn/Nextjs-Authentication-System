"use client";

import { useState, useEffect, Suspense } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { userLoginSchema } from "@/schemas/frontend/user/authSchemas";

function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      // Handle the generic "Invalid credentials" error from NextAuth
      if (authError === "CredentialsSignin") {
        setError("Invalid email or password. Please try again.");
      } else {
        // Display any other custom error message directly from the URL
        setError(authError);
      }
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof userLoginSchema>) {
    setIsLoading(true);
    setError(null);

    await signIn("credentials-user", {
      email: values.email,
      password: values.password,
      callbackUrl: "/dashboard",
    });

    setIsLoading(false);
  }

  return (
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
              <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </p>
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
  );
}

export default function UserLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <UserLoginForm />
      </Suspense>
    </div>
  );
}
