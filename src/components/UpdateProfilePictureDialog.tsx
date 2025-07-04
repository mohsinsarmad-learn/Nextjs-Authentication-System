// src/components/UpdateProfilePictureDialog.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import { toast } from "sonner";

interface UpdateProfilePictureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateProfilePictureDialog({
  open,
  onOpenChange,
}: UpdateProfilePictureDialogProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // We will implement this function in the next step
  const handleUpload = async () => {
    setIsLoading(true);
    // TODO:
    // 1. Convert the cropped area to a Blob/File.
    // 2. Get ImageKit auth params.
    // 3. Upload the new Blob to ImageKit.
    // 4. Update the user's record in the database.
    // 5. Update the session.
    alert("Upload logic not yet implemented.");
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={onSelectFile} />
          {imgSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1} // Force a square aspect ratio
                minWidth={100}
              >
                <img ref={imgRef} alt="Crop me" src={imgSrc} />
              </ReactCrop>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!completedCrop || isLoading}
            >
              {isLoading ? "Uploading..." : "Upload and Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
