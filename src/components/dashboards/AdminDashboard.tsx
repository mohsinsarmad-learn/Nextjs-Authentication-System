// src/components/dashboards/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
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
import DeleteUserDialog from "@/components/DeleteUserDialog"; // Import the new component

export default function AdminDashboard() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users.");
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // This function will be passed as a callback to the dialog
  // to update the UI instantly without a page refresh.
  const handleUserDeleted = (deletedUserId: string) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.UserId !== deletedUserId)
    );
  };

  if (isLoading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableRow
                  key={
                    typeof user._id === "string" ? user._id : String(user._id)
                  }
                >
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
                    {/* Add the delete dialog component here */}
                    <DeleteUserDialog
                      userId={user.UserId}
                      onUserDeleted={handleUserDeleted}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
