"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminEditUserDialog from "@/components/AdminEditUserDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ChangeAdminPasswordDialog from "@/components/ChangeAdminPasswordDialog";
import EditAdminProfileDialog from "@/components/EditAdminProfileDialog";
import ProfilePictureManager from "@/components/ProfilePictureManager";
import { Input } from "../ui/input";
export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<IUser[]>([]);
  const [masterUserList, setMasterUserList] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isPictureManagerOpen, setIsPictureManagerOpen] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users.");
        const data = await response.json();
        setMasterUserList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);
  const filteredUsers = useMemo(() => {
    return masterUserList.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.UserId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [masterUserList, searchQuery]);

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
    setUsers((prev) =>
      prev.map((user) =>
        user.UserId === updatedUser.UserId ? updatedUser : user
      )
    );
  };

  const handleNavigateToBulkEdit = () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user to edit.");
      return;
    }
    const idsQueryParam = selectedUserIds.join(",");
    router.push(`/dashboard/bulk-edit?ids=${idsQueryParam}`);
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
            <div
              className="cursor-pointer"
              onClick={() => setIsPictureManagerOpen(true)}
            >
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={adminUser?.image || "/default-avatar.png"}
                  alt={adminUser?.name || "Admin"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
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
            View, search, edit, and manage all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, or ID..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Bulk Action Buttons */}
            {selectedUserIds.length > 0 && (
              <div className="flex w-full sm:w-auto items-center justify-end gap-2 bg-muted p-2 rounded-lg">
                <p className="text-sm font-medium">
                  {selectedUserIds.length} selected
                </p>
                <Button
                  size="sm"
                  className="bg-blue-400 hover:bg-blue-500"
                  onClick={handleNavigateToBulkEdit}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  className="bg-red-400 hover:bg-red-500"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            )}
          </div>
          {isLoadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        onCheckedChange={(checked) =>
                          setSelectedUserIds(
                            checked ? filteredUsers.map((u) => u.UserId) : []
                          )
                        }
                        checked={
                          filteredUsers.length > 0 &&
                          selectedUserIds.length === filteredUsers.length
                        }
                      />
                    </TableHead>
                    <TableHead className="w-[100px]">Avatar</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">
                      User ID
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={String(user._id)}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUserIds.includes(user.UserId)}
                          onCheckedChange={(checked) =>
                            setSelectedUserIds((prev) =>
                              checked
                                ? [...prev, user.UserId]
                                : prev.filter((id) => id !== user.UserId)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={user.profilepic as string}
                            alt={user.firstname}
                          />
                          <AvatarFallback>
                            {user.firstname.charAt(0)}
                            {user.lastname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.UserId}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant={user.isVerified ? "default" : "destructive"}
                        >
                          {user.isVerified ? "Verified" : "Pending"}
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
                            <DropdownMenuSeparator />
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
            </div>
          )}
        </CardContent>
      </Card>

      {editingUser && (
        <AdminEditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
      <ProfilePictureManager
        open={isPictureManagerOpen}
        onOpenChange={setIsPictureManagerOpen}
        role="Admin" // Pass the correct role
      />
    </div>
  );
}
