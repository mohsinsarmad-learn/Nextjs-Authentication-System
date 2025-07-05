"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IUser } from "@/models/User";
import { adminUpdatesUserSchema } from "@/schemas/frontend/admin/authSchemas"; // Import schema

interface AdminEditUserDialogProps {
  user: IUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (updatedUser: IUser) => void;
}

export default function AdminEditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: AdminEditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof adminUpdatesUserSchema>>({
    resolver: zodResolver(adminUpdatesUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      contact: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        contact: user.contact || "",
        newPassword: "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof adminUpdatesUserSchema>) {
    setIsLoading(true);
    try {
      let newImageUrl: string | null = null;
      let newImageFileId: string | null = null;
      if (values.profileImage) {
        const authResponse = await fetch("/api/imagekit/auth");
        const authData = await authResponse.json();
        const formData = new FormData();
        formData.append("file", values.profileImage);
        formData.append(
          "publicKey",
          process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
        );
        formData.append("signature", authData.signature);
        formData.append("expire", authData.expire);
        formData.append("token", authData.token);
        formData.append("fileName", values.profileImage.name);
        formData.append("folder", "/userPics/");
        const imageKitResponse = await fetch(
          "https://upload.imagekit.io/api/v1/files/upload",
          { method: "POST", body: formData }
        );
        const imageKitData = await imageKitResponse.json();
        if (!imageKitResponse.ok) throw new Error(imageKitData.message);
        newImageUrl = imageKitData.url;
        newImageFileId = imageKitData.fileId;
      }

      const updatePayload = {
        ...values,
        newPassword: values.newPassword ? values.newPassword : undefined,
        ...(newImageUrl && { newImageUrl }),
        ...(newImageFileId && { newImageFileId }),
      };

      const response = await fetch(`/api/users/${user.UserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("User updated successfully.");
      onUserUpdated(data.user);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User: {user.firstname}</DialogTitle>
          <DialogDescription>
            Modify user details below. Email cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Email (Read-only)</FormLabel>
              <FormControl>
                <Input readOnly value={user.email} />
              </FormControl>
            </FormItem>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password (Optional)</FormLabel>
                  <FormControl>
                    {/* THIS IS THE FIX */}
                    <Input
                      type="password"
                      placeholder="Leave blank to keep unchanged"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>New Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...rest}
                      onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
