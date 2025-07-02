// src/components/dashboards/UserDashboard.tsx
"use client"; // Make this a client component

import { useSession } from "next-auth/react"; // Import the useSession hook
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileDialog from "@/components/EditProfileDialog";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { Skeleton } from "@/components/ui/skeleton";

// This component no longer needs to accept a 'user' prop
export default function UserDashboard() {
  // Get the session directly on the client side
  const { data: session, status } = useSession();

  // Handle the loading state while the session is being fetched
  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  // Ensure we have a user to display
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
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.image || "/default-avatar.png"}
                alt={user.name || "User"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
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
            <EditProfileDialog user={user} />
            <ChangePasswordDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// A skeleton component to show while loading
function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  );
}
