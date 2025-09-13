"use client";

/**
 * FileUpload Component
 * Provides drag-and-drop file upload functionality with validation and progress tracking
 */

import React, { useState, useCallback, useRef } from "react";
import {
  Upload,
  X,
  File,
  Image,
  Video,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { validateFile, uploadConfig } from "../../lib/upload-config";

export interface FileUploadItem {
  id: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  url?: string;
}

interface FileUploadProps {
  onFilesChange: (files: FileUploadItem[]) => void;
  maxFiles?: number;
  accept?: string[];
  disabled?: boolean;
  className?: string;
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  accept = uploadConfig.allowedMimeTypes,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID for files
  const generateFileId = () =>
    `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Get file type icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    if (file.type === "application/pdf" || file.type.startsWith("text/"))
      return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validate and add files
  const addFiles = useCallback(
    (newFiles: File[]) => {
      const validatedFiles: FileUploadItem[] = [];

      for (const file of newFiles) {
        // Check if we've reached max files
        if (files.length + validatedFiles.length >= maxFiles) {
          break;
        }

        // Check if file already exists
        const exists = files.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        );
        if (exists) {
          continue;
        }

        // Validate file
        const validation = validateFile(file);
        const fileItem: FileUploadItem = {
          id: generateFileId(),
          file,
          status: validation.valid ? "pending" : "error",
          progress: 0,
          error: validation.error,
        };

        validatedFiles.push(fileItem);
      }

      if (validatedFiles.length > 0) {
        const updatedFiles = [...files, ...validatedFiles];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }
    },
    [files, maxFiles, onFilesChange]
  );

  // Remove file
  const removeFile = useCallback(
    (fileId: string) => {
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  // Update file status
  const updateFileStatus = useCallback(
    (fileId: string, updates: Partial<FileUploadItem>) => {
      const updatedFiles = files.map((f) =>
        f.id === fileId ? { ...f, ...updates } : f
      );
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  // Handle drag events
  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    [disabled, addFiles]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
        // Reset input value to allow selecting the same file again
        e.target.value = "";
      }
    },
    [addFiles]
  );

  // Open file dialog
  const openFileDialog = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragOver
            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
            : "border-gray-300 hover:border-red-400 dark:border-gray-600 dark:hover:border-red-500"
        } ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
        } `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Upload className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Drop files here or click to browse
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Upload up to {maxFiles} files. Max size:{" "}
              {formatFileSize(uploadConfig.maxFileSize)}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Supported: Images, Videos, PDFs, Text files
            </p>
          </div>

          {files.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {files.length} of {maxFiles} files selected
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Selected Files ({files.length})
          </h4>

          <div className="space-y-2">
            {files.map((fileItem) => {
              const FileIcon = getFileIcon(fileItem.file);

              return (
                <div
                  key={fileItem.id}
                  className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    <FileIcon className="h-8 w-8 text-gray-400" />
                  </div>

                  {/* File Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {fileItem.file.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(fileItem.id);
                        }}
                        className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        disabled={disabled}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(fileItem.file.size)} •{" "}
                      {fileItem.file.type}
                    </p>

                    {/* Status Messages */}
                    {fileItem.status === "error" && fileItem.error && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="h-3 w-3" />
                        <span>{fileItem.error}</span>
                      </div>
                    )}

                    {fileItem.status === "success" && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Upload complete</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <div className="text-gray-900 dark:text-white">
                Total: {files.length} files (
                {formatFileSize(files.reduce((acc, f) => acc + f.file.size, 0))}
                )
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Valid: {files.filter((f) => f.status !== "error").length} •
                Errors: {files.filter((f) => f.status === "error").length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export types for use in other components
