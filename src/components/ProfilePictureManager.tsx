// src/components/ProfilePictureManager.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import ReactCrop, {
  type Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
} from "lucide-react";

// --- Helper function to get the cropped image data as a File ---
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const file = new File([blob], fileName, { type: "image/png" });
      resolve(file);
    }, "image/png");
  });
}

// --- Component Props ---
interface ProfilePictureManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: "User" | "Admin"; // To determine which API and folder to use
}

// --- Main Component ---
export default function ProfilePictureManager({
  open,
  onOpenChange,
  role,
}: ProfilePictureManagerProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [view, setView] = useState<"main" | "crop" | "upload">("main");
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const CROP_SIZE_PX = 350;
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setView("main");
        setImgSrc("");
      }, 200);
    }
    onOpenChange(isOpen);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    // Create a centered crop with a fixed pixel size
    const crop = centerCrop(
      makeAspectCrop({ unit: "px", width: CROP_SIZE_PX }, 1, width, height),
      width,
      height
    );
    setCrop(crop);
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setView("crop");
      });
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error("Crop selection is invalid. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      // 1. Get the cropped image data as a File object
      const croppedImageFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        "new-avatar.png"
      );

      // 2. Get temporary auth params from our backend
      const authResponse = await fetch("/api/imagekit/auth");
      const authData = await authResponse.json();

      // 3. Prepare and upload the cropped image to ImageKit
      const formData = new FormData();
      formData.append("file", croppedImageFile);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
      );
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire);
      formData.append("token", authData.token);
      formData.append("fileName", croppedImageFile.name);
      formData.append(
        "folder",
        role === "Admin" ? "/adminPics/" : "/userPics/"
      );

      const imageKitResponse = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        { method: "POST", body: formData }
      );
      const imageKitData = await imageKitResponse.json();
      if (!imageKitResponse.ok)
        throw new Error(imageKitData.message || "Image upload failed.");

      // 4. Update the user/admin record in our database
      const updateUrl =
        role === "Admin"
          ? "/api/profile/admin/picture"
          : "/api/profile/user/picture";
      const updateResponse = await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only send the fields we are updating
          newImageUrl: imageKitData.url,
          newImageFileId: imageKitData.fileId,
        }),
      });
      if (!updateResponse.ok)
        throw new Error("Failed to save new profile picture.");

      // 5. Update the session and refresh the page to show changes instantly
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

  const renderMainView = () => (
    <div className="flex flex-col items-center text-center space-y-4 pt-4">
      <Avatar className="h-40 w-40">
        <AvatarImage src={session?.user?.image || "/default-avatar.png"} />
        <AvatarFallback className="text-5xl">
          {session?.user?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <p className="text-xl font-semibold">{session?.user?.name}</p>
      <div className="flex gap-2 pt-4">
        <Button onClick={() => setView("upload")}>
          <Camera className="mr-2 h-4 w-4" />
          Change
        </Button>
        <Button variant="outline">
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </div>
    </div>
  );

  const renderCropView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setImgSrc("");
            setView("upload");
          }}
        >
          <ArrowLeft />
        </Button>
        <h3 className="text-lg font-semibold">Crop your new picture</h3>
      </div>
      <div className="flex justify-center bg-muted rounded-lg">
        {imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            // --- THESE PROPS FIX THE CROP SIZE ---
            minWidth={CROP_SIZE_PX}
            minHeight={CROP_SIZE_PX}
            maxWidth={CROP_SIZE_PX}
            maxHeight={CROP_SIZE_PX}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
              style={{ maxHeight: "70vh" }}
            />
          </ReactCrop>
        )}
      </div>
      <div className="flex justify-end items-center mt-6">
        <Button onClick={handleSave} disabled={!completedCrop || isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save as profile picture"}
        </Button>
      </div>
    </div>
  );

  const renderUploadView = () => (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setView("main")}>
          <ArrowLeft />
        </Button>
        <h3 className="text-lg font-semibold">Change profile picture</h3>
      </div>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="h-16 w-16 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Drag & drop an image</p>
        <p className="text-sm text-muted-foreground">
          or click to select a file
        </p>
      </div>
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
        {view === "upload" && renderUploadView()}
        {view === "crop" && renderCropView()}
      </DialogContent>
    </Dialog>
  );
}
