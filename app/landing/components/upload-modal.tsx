"use client";

import React, { useState } from "react";
import { X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate upload delay
    setTimeout(() => {
      setIsLoading(false);
      alert("Document uploaded successfully!");
      onClose();
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-card rounded-xl shadow-2xl border animate-in zoom-in-95 duration-200 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors opacity-70 hover:opacity-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <TypographyH3 className="text-2xl">
            Secure Document Upload
          </TypographyH3>
          <TypographyMuted>
            Please fill in your details and attach the required documents.
          </TypographyMuted>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" placeholder="Acme Inc." />
          </div>

          <div className="space-y-2">
            <Label>Document Attachment</Label>
            <div className="border-2 border-dashed border-input rounded-xl p-8 transition-colors hover:bg-muted/50 text-center cursor-pointer relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                required
              />
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-muted-foreground" />
                {file ? (
                  <div className="text-sm font-medium text-foreground">
                    {file.name}
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, or Images up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={isLoading || !file}
            >
              {isLoading ? "Uploading..." : "Submit Securely"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
