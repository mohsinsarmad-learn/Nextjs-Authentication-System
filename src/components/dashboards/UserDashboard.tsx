"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Import all the profile components
import EditUserProfileDialog from "@/components/EditUserProfileDialog";
import ChangePasswordDialog from "@/components/ChangeUserPasswordDialog";
import ProfilePictureManager from "@/components/ProfilePictureManager";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [isPictureManagerOpen, setIsPictureManagerOpen] = useState(false);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (status === "unauthenticated" || !session?.user) {
    return <p>Access Denied. Please sign in.</p>;
  }

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "?";

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            View and manage your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div
              className="cursor-pointer"
              onClick={() => setIsPictureManagerOpen(true)}
            >
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || "User"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="font-semibold">{user.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                User ID
              </p>
              <p className="font-semibold">{user.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EditUserProfileDialog />
            <ChangePasswordDialog />
          </div>
        </CardContent>
      </Card>

      {/* Render the ProfilePictureManager dialog */}
      <ProfilePictureManager
        open={isPictureManagerOpen}
        onOpenChange={setIsPictureManagerOpen}
        role="User" // Pass the 'User' role
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
