// src/components/dashboards/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/models/User";
import DeleteUserDialog from "@/components/DeleteUserDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import EditAdminProfileDialog from "@/components/EditAdminProfileDialog";
import ChangeAdminPasswordDialog from "@/components/ChangeAdminPasswordDialog";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserDeleted = (deletedUserId: string) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.UserId !== deletedUserId)
    );
  };

  if (status === "loading") {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  const adminUser = session?.user;
  const initials =
    adminUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "?";

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Admin's Own Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Admin Profile</CardTitle>
          <CardDescription>
            View and manage your personal admin information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={adminUser?.image || "/default-avatar.png"}
                alt={adminUser?.name || "Admin"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{adminUser?.name}</h2>
              <p className="text-muted-foreground">{adminUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditAdminProfileDialog user={adminUser} />
            <ChangeAdminPasswordDialog />
          </div>
        </CardContent>
      </Card>

      {/* Existing User Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={(user._id as string).toString()}>
                    <TableCell>{user.UserId}</TableCell>
                    <TableCell>
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isVerified ? "default" : "destructive"}
                      >
                        {user.isVerified ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteUserDialog
                        userId={user.UserId}
                        onUserDeleted={handleUserDeleted}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
