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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminEditUserDialog from "@/components/AdminEditUserDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ChangeAdminPasswordDialog from "@/components/ChangeAdminPasswordDialog";
import EditAdminProfileDialog from "@/components/EditAdminProfileDialog";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

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
    setUsers((prev) => prev.filter((user) => user.UserId !== deletedUserId));
    setSelectedUserIds((prev) => prev.filter((id) => id !== deletedUserId));
  };

  const handleBulkDelete = async () => {
    const promise = fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: selectedUserIds }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to delete selected users.");
      return res.json();
    });

    toast.promise(promise, {
      loading: `Deleting ${selectedUserIds.length} user(s)...`,
      success: (data) => {
        setUsers((prev) =>
          prev.filter((user) => !selectedUserIds.includes(user.UserId))
        );
        setSelectedUserIds([]);
        return data.message;
      },
      error: (err) => err.message,
    });
  };

  const handleUserUpdated = (updatedUser: IUser) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.UserId === updatedUser.UserId ? updatedUser : user
      )
    );
  };

  if (status === "loading" || isLoadingUsers) {
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
          {selectedUserIds.length > 0 && (
            <div className="mb-4 flex items-center gap-2 bg-muted p-2 rounded-lg">
              <p className="text-sm font-medium">
                {selectedUserIds.length} user(s) selected.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
              </Button>
            </div>
          )}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedUserIds.length === users.length &&
                        users.length > 0
                      }
                      onCheckedChange={(checked) => {
                        setSelectedUserIds(
                          checked ? users.map((u) => u.UserId) : []
                        );
                      }}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={String(user._id)}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.includes(user.UserId)}
                        onCheckedChange={(checked) => {
                          setSelectedUserIds((prev) =>
                            checked
                              ? [...prev, user.UserId]
                              : prev.filter((id) => id !== user.UserId)
                          );
                        }}
                        aria-label={`Select row for ${user.firstname}`}
                      />
                    </TableCell>
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
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
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
          </div>
          {editingUser && (
            <AdminEditUserDialog
              user={editingUser}
              open={!!editingUser}
              onOpenChange={() => setEditingUser(null)}
              onUserUpdated={handleUserUpdated}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
