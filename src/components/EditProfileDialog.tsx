// src/components/EditProfileDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react"; // Import the useSession hook

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { User as UserIcon } from "lucide-react";

interface EditProfileDialogProps {
  user: { id?: string | null; name?: string | null };
}

const formSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters."),
  lastname: z.string().min(2, "Last name must be at least 2 characters."),
  contact: z.string().optional(),
  profileImage: z.instanceof(File).optional(),
});

export default function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession(); // Get the update function from the hook

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstname: "", lastname: "", contact: "" },
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/profile/user")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            form.reset({
              firstname: data.firstname,
              lastname: data.lastname,
              contact: data.contact || "",
            });
          }
        });
    }
  }, [isOpen, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        if (!imageKitResponse.ok)
          throw new Error(imageKitData.message || "Image upload failed.");
        newImageUrl = imageKitData.url;
        newImageFileId = imageKitData.fileId;
      }

      const updatePayload = {
        firstname: values.firstname,
        lastname: values.lastname,
        contact: values.contact,
        ...(newImageUrl && { newImageUrl }),
        ...(newImageFileId && { newImageFileId }),
      };

      const updateResponse = await fetch("/api/profile/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!updateResponse.ok) {
        const updateData = await updateResponse.json();
        throw new Error(updateData.message || "Failed to update profile.");
      }

      // Manually trigger a session update to refetch the user's data
      await update();

      toast.success("Profile updated successfully.");
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Update Profile Error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserIcon className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
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
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
