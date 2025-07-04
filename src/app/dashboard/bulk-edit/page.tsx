// src/app/dashboard/bulk-edit/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IUser } from "@/models/User";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import UserEditFormCard from "@/components/UserEditFormCard";
import { toast } from "sonner";

function BulkEditPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get("ids");

  const [users, setUsers] = useState<IUser[]>([]);
  const [isFetching, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ids) {
      setError("No users selected.");
      setIsLoading(false);
      return;
    }
    const fetchUsersData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users?ids=${ids}`);
        if (!response.ok) throw new Error("Failed to fetch user data.");
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersData();
  }, [ids]);

  const handleDataChange = (
    userId: string,
    field: string,
    value: string | File
  ) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.UserId === userId) {
          // Use Object.assign to preserve prototype chain
          const updatedUser = Object.assign(
            Object.create(Object.getPrototypeOf(user)),
            user
          );
          (updatedUser as any)[field] = value;
          return updatedUser;
        }
        return user;
      })
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    toast.info("Starting bulk update process...");

    try {
      // --- Step 1: Handle all image uploads concurrently ---
      const imageKitAuthParams = await fetch("/api/imagekit/auth").then((res) =>
        res.json()
      );

      const uploadPromises = users.map(async (user) => {
        // The profilepic will be a File object if a new one was selected
        if (user.profilepic instanceof File) {
          const formData = new FormData();
          formData.append("file", user.profilepic);
          formData.append(
            "publicKey",
            process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
          );
          formData.append("signature", imageKitAuthParams.signature);
          formData.append("expire", imageKitAuthParams.expire);
          formData.append("token", imageKitAuthParams.token);
          formData.append("fileName", user.profilepic.name);
          formData.append("folder", "/userPics/");

          const response = await fetch(
            "https://upload.imagekit.io/api/v1/files/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();
          if (!response.ok)
            throw new Error(`Image upload failed for ${user.email}`);

          // Return the new image data along with the user ID
          return {
            userId: user.UserId,
            newImageUrl: result.url,
            newImageFileId: result.fileId,
          };
        }
        return null; // Return null if no new image for this user
      });

      const uploadResults = await Promise.all(uploadPromises);

      // --- Step 2: Prepare the final data payload for all users ---
      const finalUpdatePayload = users.map((user) => {
        const uploadedImageData = uploadResults.find(
          (res) => res?.userId === user.UserId
        );
        return {
          userId: user.UserId,
          firstname: user.firstname,
          lastname: user.lastname,
          contact: user.contact,
          newPassword: (user as any).newPassword || undefined,
          newImageUrl: uploadedImageData?.newImageUrl,
          newImageFileId: uploadedImageData?.newImageFileId,
        };
      });

      // --- Step 3: Send the entire payload to the backend ---
      const response = await fetch("/api/users/bulk-update-detailed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalUpdatePayload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save changes.");
      }

      toast.success("All users updated successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) return <div className="p-8">Loading user data...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 py-4 z-10">
        <div>
          <h1 className="text-3xl font-bold">Bulk Edit Users</h1>
          <p className="text-muted-foreground">
            Editing {users.length} user(s).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
            </Link>
          </Button>
          <Button onClick={handleSaveAll} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <UserEditFormCard
            key={user.UserId}
            user={user}
            onDataChange={handleDataChange}
          />
        ))}
      </div>
    </div>
  );
}

export default function BulkEditPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <BulkEditPageContent />
    </Suspense>
  );
}
