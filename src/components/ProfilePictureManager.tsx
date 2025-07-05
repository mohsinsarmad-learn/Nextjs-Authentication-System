"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import Cropper, { Area } from "react-easy-crop";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Avatar from "boring-avatars";

import { getCroppedImg, svgToPngFile } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Camera,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  Loader2,
  ZoomIn,
  Sparkles,
  Shuffle,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

type View = "main" | "selectSource" | "crop" | "generate";

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
  const [view, setView] = useState<View>("main");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [avatarSeed, setAvatarSeed] = useState("");
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user?.name) {
      setAvatarSeed(session.user.name);
    }
  }, [session]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setView("main");
        setImageSrc(null);
      }, 200);
    }
    onOpenChange(isOpen);
  };

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

  const handleSaveCroppedImage = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      toast.error("Could not process image. Please try cropping again.");
      return;
    }
    setIsLoading(true);
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImageFile) throw new Error("Could not crop image.");

      await uploadFile(croppedImageFile);

      toast.success("Profile picture updated successfully!");
      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneratedAvatar = async () => {
    if (!avatarRef.current) {
      toast.error("Avatar element not found. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      const svgElement = avatarRef.current.querySelector("svg");
      if (!svgElement) throw new Error("Could not find SVG to save.");

      const avatarFile = await svgToPngFile(
        svgElement.outerHTML,
        "generated-avatar.png"
      );
      await uploadFile(avatarFile);

      toast.success("New avatar saved successfully!");
      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const authResponse = await fetch("/api/imagekit/auth").then((res) =>
      res.json()
    );
    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
    formData.append("signature", authResponse.signature);
    formData.append("expire", authResponse.expire);
    formData.append("token", authResponse.token);
    formData.append("fileName", file.name);
    formData.append("folder", role === "Admin" ? "/adminPics/" : "/userPics/");

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
    const dbUpdateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newImageUrl: imageKitResponse.url,
        newImageFileId: imageKitResponse.fileId,
      }),
    });
    if (!dbUpdateResponse.ok)
      throw new Error("Failed to save new profile picture.");

    await update();
    router.refresh();
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
      <UIAvatar className="h-40 w-40">
        <AvatarImage src={session?.user?.image || "/default-avatar.png"} />
        <AvatarFallback className="text-5xl">
          {session?.user?.name?.charAt(0)}
        </AvatarFallback>
      </UIAvatar>
      <p className="text-xl font-semibold">{session?.user?.name}</p>
      <div className="flex gap-2 pt-4">
        <Button onClick={() => setView("selectSource")}>
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

  const renderSelectSourceView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setView("main")}>
          <ArrowLeft />
        </Button>
        <h3 className="text-lg font-semibold">Change profile picture</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "hover:border-primary/50"}`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 font-semibold">Upload a photo</p>
          <p className="text-sm text-center text-muted-foreground">
            Drag & drop or click to select
          </p>
        </div>
        <div
          onClick={() => setView("generate")}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-primary/50"
        >
          <Sparkles className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 font-semibold">Generate an avatar</p>
          <p className="text-sm text-center text-muted-foreground">
            Create a unique avatar
          </p>
        </div>
      </div>
    </div>
  );

  const renderCropView = () => (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setImageSrc(null);
            setView("selectSource");
          }}
        >
          <ArrowLeft />
        </Button>
        <h3 className="text-lg font-semibold">Position and zoom your image</h3>
      </div>
      <div className="relative h-64 w-full bg-muted rounded-lg">
        <Cropper
          image={imageSrc!}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="w-full space-y-2 mt-4">
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
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveCroppedImage} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
          {isLoading ? "Saving..." : "Save Picture"}
        </Button>
      </div>
    </div>
  );

  const renderGenerateView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView("selectSource")}
        >
          <ArrowLeft />
        </Button>
        <h3 className="text-lg font-semibold">Generate a unique avatar</h3>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div ref={avatarRef}>
          <Avatar
            size={200}
            name={avatarSeed}
            variant="beam"
            colors={["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"]}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setAvatarSeed(Math.random().toString())}
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Generate New
        </Button>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveGeneratedAvatar} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save this Avatar"}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
          <DialogDescription>Manage your profile picture.</DialogDescription>
        </DialogHeader>
        {view === "main" && renderMainView()}
        {view === "selectSource" && renderSelectSourceView()}
        {view === "crop" && imageSrc && renderCropView()}
        {view === "generate" && renderGenerateView()}
      </DialogContent>
    </Dialog>
  );
}
