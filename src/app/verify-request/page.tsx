"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MailCheck } from "lucide-react";

function VerifyRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams.get("type") || "user";

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (progress >= 100) {
      const loginPath = type === "admin" ? "/login/admin" : "/login/user";
      router.push(loginPath);
    }
  }, [progress, router, type]);

  const message =
    type === "admin"
      ? `A verification request has been sent to the IT Department at ${email}. Once approved, you can log in.`
      : `A verification link has been sent to your email address: ${email}. Please check your inbox.`;

  const redirectingMessage = `Redirecting to login page...`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full">
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl">Check Your Inbox</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">{redirectingMessage}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyRequestContent />
    </Suspense>
  );
}
