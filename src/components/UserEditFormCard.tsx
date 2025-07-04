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
}

export default function UserEditFormCard({
  user,
  onDataChange,
}: UserEditFormCardProps) {
  const initials = user.firstname?.charAt(0) + user.lastname?.charAt(0) || "?";

  // A handler to manage changes for all inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files) {
      onDataChange(user.UserId, name, files[0]);
    } else {
      onDataChange(user.UserId, name, value);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.profilepic as string} />
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
          </div>
          <div>
            <Label htmlFor={`lastname-${user.UserId}`}>Last Name</Label>
            <Input
              id={`lastname-${user.UserId}`}
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
            />
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
          </div>
        </div>
        <div>
          <Label htmlFor={`profileImage-${user.UserId}`}>
            New Profile Picture
          </Label>
          <Input
            id={`profileImage-${user.UserId}`}
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
