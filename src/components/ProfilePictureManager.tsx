// src/components/ProfilePictureManager.tsx
"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import Cropper, { Area } from "react-easy-crop";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getCroppedImg } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Camera,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  Loader2,
  ZoomIn,
  RotateCw,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface ProfilePictureManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: "User" | "Admin";
}

export default function ProfilePictureManager({
  open,
  onOpenChange,
  role,
}: ProfilePictureManagerProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [view, setView] = useState<"main" | "edit">("main");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
        setView("edit");
      });
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setView("main");
        setImageSrc(null);
        setZoom(1);
        setRotation(0);
      }, 200);
    }
    onOpenChange(isOpen);
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setIsLoading(true);
    try {
      const croppedImageFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (!croppedImageFile) throw new Error("Could not crop image.");

      const authResponse = await fetch("/api/imagekit/auth").then((res) =>
        res.json()
      );
      const formData = new FormData();
      formData.append("file", croppedImageFile);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
      );
      formData.append("signature", authResponse.signature);
      formData.append("expire", authResponse.expire);
      formData.append("token", authResponse.token);
      formData.append("fileName", croppedImageFile.name);
      formData.append(
        "folder",
        role === "Admin" ? "/adminPics/" : "/userPics/"
      );

      const imageKitResponse = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        { method: "POST", body: formData }
      ).then((res) => res.json());
      if (!imageKitResponse.fileId)
        throw new Error(imageKitResponse.message || "Image upload failed.");

      const updateUrl =
        role === "Admin"
          ? `/api/profile/admin/picture`
          : `/api/profile/user/picture`;
      await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newImageUrl: imageKitResponse.url,
          newImageFileId: imageKitResponse.fileId,
        }),
      });

      await update();
      toast.success("Profile picture updated successfully!");
      handleOpenChange(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    const promise = fetch(
      role === "Admin"
        ? "/api/profile/admin/picture"
        : "/api/profile/user/picture",
      {
        method: "DELETE",
      }
    ).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to remove picture.");
      }
      await update();
      handleOpenChange(false);
      router.refresh();
    });

    toast.promise(promise, {
      loading: "Removing picture...",
      success: "Profile picture removed.",
      error: (err) => err.message,
    });
    setIsLoading(false);
  };

  const renderMainView = () => (
    <div className="flex flex-col items-center text-center space-y-4 pt-4">
      <Avatar className="h-40 w-40">
        <AvatarImage
          src={session?.user?.image || "/default-avatar.png"}
          alt={session?.user?.name || ""}
        />
        <AvatarFallback className="text-5xl">
          {session?.user?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <p className="text-xl font-semibold">{session?.user?.name}</p>
      <div className="flex gap-2 pt-4">
        <Button onClick={() => setView("edit")}>
          <Camera className="mr-2 h-4 w-4" />
          Change
        </Button>
        <Button
          variant="outline"
          onClick={handleRemove}
          disabled={!session?.user?.image || isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Remove
        </Button>
      </div>
    </div>
  );

  const renderEditView = () =>
    imageSrc ? (
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setView("main")}>
            <ArrowLeft />
          </Button>
          <h3 className="text-lg font-semibold">
            Position and zoom your image
          </h3>
        </div>
        <div className="relative h-64 w-full bg-muted rounded-lg">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="w-full space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="zoom-slider" className="flex items-center">
              <ZoomIn className="mr-2 h-4 w-4" />
              Zoom
            </Label>
            <Slider
              id="zoom-slider"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rotation-slider" className="flex items-center">
              <RotateCw className="mr-2 h-4 w-4" />
              Rotate
            </Label>
            <Slider
              id="rotation-slider"
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            {...getRootProps({ onClick: (event) => event.preventDefault() })}
          >
            <input {...getInputProps()} />
            Change Image
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            {isLoading ? "Saving..." : "Save Picture"}
          </Button>
        </div>
      </div>
    ) : (
      <div
        {...getRootProps()}
        className={`mt-4 flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="h-16 w-16 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Drag & drop an image</p>
        <p className="text-sm text-muted-foreground">or click to select</p>
      </div>
    );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
          <DialogDescription>
            Your profile picture is visible to other users on the platform.
          </DialogDescription>
        </DialogHeader>
        {view === "main" && renderMainView()}
        {view === "edit" && renderEditView()}
      </DialogContent>
    </Dialog>
  );
}
