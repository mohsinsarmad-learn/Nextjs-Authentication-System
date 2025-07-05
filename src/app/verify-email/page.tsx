"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token not found.");
        return;
      }
      try {
        const response = await fetch(`/api/verify-token?token=${token}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Verification failed.");
        }
        setStatus("success");
        setMessage(data.message || "Account verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "An error occurred during verification.");
      }
    };
    verifyToken();
  }, [token]);

  const handleProceedToLogin = () => {
    const loginPath = type === "admin" ? "/login/admin" : "/login/user";
    router.push(loginPath);
  };

  const renderIcon = () => {
    switch (status) {
      case "verifying":
        return (
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        );
      case "success":
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      case "error":
        return <XCircle className="h-10 w-10 text-destructive" />;
    }
  };

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Please wait while we verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">{renderIcon()}</div>
        <p className="text-lg font-medium">{message}</p>
        {status !== "verifying" && (
          <Button onClick={handleProceedToLogin} className="w-full">
            Proceed to {type === "admin" ? "Admin" : "User"} Login
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
