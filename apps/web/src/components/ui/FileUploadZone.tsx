"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, FileText, CheckCircle2, X } from "lucide-react";

export interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  label?: string;
  description?: string;
  className?: string;
}

export function FileUploadZone({
  onFileSelect,
  acceptedFormats = [".pdf", ".docx", ".txt"],
  maxSizeMB = 10,
  label = "Upload document or resume",
  description = "Drag & drop your file here, or browse from computer",
  className,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-1.5">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            inputRef.current?.click();
          }
        }}
        aria-label={label}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          isDragging
            ? "border-brand-500 bg-brand-50/50"
            : "border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400",
          selectedFile && "border-emerald-400 bg-emerald-50/30",
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Parsing
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-subtle text-slate-600 mb-3">
              <UploadCloud className="h-6 w-6 text-brand-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Accepted: {acceptedFormats.join(", ")} (Up to {maxSizeMB}MB)
            </p>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
