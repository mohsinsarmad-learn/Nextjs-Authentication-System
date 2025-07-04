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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminEditUserDialog from "@/components/AdminEditUserDialog";
import EditAdminProfileDialog from "@/components/EditAdminProfileDialog";
import ChangeAdminPasswordDialog from "@/components/ChangeAdminPasswordDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to control the edit dialog for a specific user
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

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

  // Callback to update UI instantly after a user is deleted
  const handleUserDeleted = (deletedUserId: string) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.UserId !== deletedUserId)
    );
  };

  // Callback to update UI instantly after a user is edited
  const handleUserUpdated = (updatedUser: IUser) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.UserId === updatedUser.UserId ? updatedUser : user
      )
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

      {/* User Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <Skeleton className="h-40 w-full" />
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => setEditingUser(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {/* The DeleteUserDialog trigger is now wrapped inside a DropdownMenuItem */}
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="p-0"
                          >
                            <DeleteUserDialog
                              userId={user.UserId}
                              onUserDeleted={handleUserDeleted}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* The Edit User Dialog is rendered here conditionally */}
      {editingUser && (
        <AdminEditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}
