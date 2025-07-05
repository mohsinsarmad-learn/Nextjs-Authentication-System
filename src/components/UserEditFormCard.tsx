// src/components/UserEditFormCard.tsx
"use client";

import { IUser } from "@/models/User";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface UserEditFormCardProps {
  user: IUser;
  onDataChange: (userId: string, field: string, value: string | File) => void;
  // Add a prop to accept validation errors for this specific user
  errors?: Record<string, string[] | undefined>;
}

export default function UserEditFormCard({
  user,
  onDataChange,
  errors = {},
}: UserEditFormCardProps) {
  const initials = user.firstname?.charAt(0) + user.lastname?.charAt(0) || "?";

  const getAvatarSrc = () => {
    if (user.profilepic instanceof File) {
      return URL.createObjectURL(user.profilepic);
    }
    return user.profilepic as string;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profilepic" && files) {
      onDataChange(user.UserId, name, files[0]);
    } else {
      onDataChange(user.UserId, name, value);
    }
  };

  // Helper to display error messages
  const ErrorMessage = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-destructive mt-1">{errors[field]?.[0]}</p>
    ) : null;

  return (
    <Card
      className={Object.keys(errors).length > 0 ? "border-destructive" : ""}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={getAvatarSrc()} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {user.firstname} {user.lastname}
          </CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`firstname-${user.UserId}`}>First Name</Label>
            <Input
              id={`firstname-${user.UserId}`}
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
            />
            <ErrorMessage field="firstname" />
          </div>
          <div>
            <Label htmlFor={`lastname-${user.UserId}`}>Last Name</Label>
            <Input
              id={`lastname-${user.UserId}`}
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
            />
            <ErrorMessage field="lastname" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`contact-${user.UserId}`}>Contact (Optional)</Label>
            <Input
              id={`contact-${user.UserId}`}
              name="contact"
              value={user.contact || ""}
              onChange={handleChange}
            />
            <ErrorMessage field="contact" />
          </div>
          <div>
            <Label htmlFor={`newPassword-${user.UserId}`}>
              New Password (Optional)
            </Label>
            <Input
              id={`newPassword-${user.UserId}`}
              name="newPassword"
              type="password"
              placeholder="Leave blank to keep unchanged"
              autoComplete="new-password"
              onChange={handleChange}
            />
            <ErrorMessage field="newPassword" />
          </div>
        </div>
        <div>
          <Label htmlFor={`profilepic-${user.UserId}`}>
            New Profile Picture
          </Label>
          <Input
            id={`profilepic-${user.UserId}`}
            name="profilepic"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
