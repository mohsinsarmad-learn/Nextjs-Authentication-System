// src/components/dashboards/UserDashboard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User as UserIcon } from "lucide-react";
import EditProfileDialog from "@/components/EditProfileDialog";
// Define the shape of the user prop
interface UserDashboardProps {
  user: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function UserDashboard({ user }: UserDashboardProps) {
  // Create initials for the avatar fallback
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
              {/* The 'image' field from your session maps to 'profilepic' */}
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

          <EditProfileDialog user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
