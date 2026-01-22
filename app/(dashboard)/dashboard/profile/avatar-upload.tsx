"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { updateProfileAvatar } from "./actions";
import { Camera, Loader2 } from "lucide-react";
import Alert from "@/components/custom-alert";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  userId: string;
  avatarUrl: string | null;
  fallback: string;
  className?: string;
}

export function AvatarUpload({
  userId,
  avatarUrl: initialAvatarUrl,
  fallback,
  className,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      setAlert({
        type: "error",
        message: "File size must be less than 2MB",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAlert({
        type: "error",
        message: "File must be an image",
      });
      return;
    }

    try {
      setIsUploading(true);
      setAlert(null);

      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const result = await updateProfileAvatar(publicUrl);

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      setAvatarUrl(publicUrl);
      setAlert({
        type: "success",
        message: "Profile picture updated successfully",
      });
      router.refresh();
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setAlert({
        type: "error",
        message: error.message || "Failed to upload avatar",
      });
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {alert && (
        <Alert
          type={alert.type as "success" | "error"}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <Avatar className="h-full w-full">
        <AvatarImage
          src={avatarUrl || ""}
          className={cn("object-cover", isUploading && "opacity-50")}
        />
        <AvatarFallback className="text-2xl">{fallback}</AvatarFallback>
      </Avatar>
      
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </div>
      )}

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer disabled:cursor-not-allowed"
      >
        <Camera className="w-6 h-6" />
        <span className="sr-only">Change Avatar</span>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
