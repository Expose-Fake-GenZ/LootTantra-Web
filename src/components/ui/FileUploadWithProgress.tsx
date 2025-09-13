"use client";

/**
 * FileUploadWithProgress Component
 * Enhanced file upload component with integrated upload functionality and progress tracking
 */

import React, { useState, useCallback } from "react";
import { Upload, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import FileUpload, { type FileUploadItem } from "./FileUpload";
import { useFileUpload } from "../../hooks/useFileUpload";
import Button from "./Button";

interface FileUploadWithProgressProps {
  onUploadComplete?: (results: any[]) => void;
  onUploadError?: (error: string) => void;
  reportId?: string;
  maxFiles?: number;
  accept?: string[];
  disabled?: boolean;
  className?: string;
  autoUpload?: boolean;
}

export default function FileUploadWithProgress({
  onUploadComplete,
  onUploadError,
  reportId,
  maxFiles = 5,
  accept,
  disabled = false,
  className = "",
  autoUpload = false,
}: FileUploadWithProgressProps) {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [uploadResults, setUploadResults] = useState<unknown[]>([]);
  const { uploadFiles, isUploading } = useFileUpload();

  // Handle files change from FileUpload component
  const handleFilesChange = useCallback(
    (newFiles: FileUploadItem[]) => {
      setFiles(newFiles);

      // Auto-upload if enabled and there are valid files
      if (autoUpload && newFiles.some((f) => f.status === "pending")) {
        handleUpload(newFiles);
      }
    },
    [autoUpload]
  );

  // Handle upload process
  const handleUpload = useCallback(
    async (filesToUpload?: FileUploadItem[]) => {
      const targetFiles = filesToUpload || files;
      const validFiles = targetFiles.filter((f) => f.status === "pending");

      if (validFiles.length === 0) {
        onUploadError?.("No valid files to upload");
        return;
      }

      try {
        // Update file status to uploading
        const updatedFiles = targetFiles.map((f) =>
          f.status === "pending"
            ? { ...f, status: "uploading" as const, progress: 0 }
            : f
        );
        setFiles(updatedFiles);

        // Upload files with progress tracking
        const response = await uploadFiles(validFiles, {
          reportId,
          onProgress: (fileId, progress) => {
            setFiles((prev) =>
              prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
            );
          },
          onSuccess: (fileId, result) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? { ...f, status: "success", progress: 100, url: result.url }
                  : f
              )
            );
          },
          onError: (fileId, error) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, status: "error", error } : f
              )
            );
          },
        });

        // Store results
        setUploadResults(response.files);

        // Notify parent component
        if (response.success) {
          onUploadComplete?.(response.files);
        } else {
          onUploadError?.(response.errors?.[0]?.error || "Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);

        // Mark all uploading files as error
        setFiles((prev) =>
          prev.map((f) =>
            f.status === "uploading"
              ? {
                  ...f,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : f
          )
        );

        onUploadError?.(
          error instanceof Error ? error.message : "Upload failed"
        );
      }
    },
    [files, uploadFiles, reportId, onUploadComplete, onUploadError]
  );

  // Retry failed uploads
  const retryFailedUploads = useCallback(() => {
    const failedFiles = files.filter((f) => f.status === "error");
    const retriedFiles = files.map((f) =>
      f.status === "error"
        ? { ...f, status: "pending" as const, error: undefined }
        : f
    );
    setFiles(retriedFiles);
    handleUpload(retriedFiles);
  }, [files, handleUpload]);

  // Clear all files
  const clearFiles = useCallback(() => {
    setFiles([]);
    setUploadResults([]);
  }, []);

  // Get upload statistics
  const stats = {
    total: files.length,
    pending: files.filter((f) => f.status === "pending").length,
    uploading: files.filter((f) => f.status === "uploading").length,
    success: files.filter((f) => f.status === "success").length,
    error: files.filter((f) => f.status === "error").length,
  };

  const hasValidFiles = stats.pending > 0 || stats.uploading > 0;
  const hasErrors = stats.error > 0;
  const allComplete =
    stats.total > 0 && stats.pending === 0 && stats.uploading === 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* File Upload Component */}
      <FileUpload
        onFilesChange={handleFilesChange}
        maxFiles={maxFiles}
        accept={accept}
        disabled={disabled || isUploading}
      />

      {/* Upload Controls */}
      {files.length > 0 && !autoUpload && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center space-x-4">
            {/* Upload Button */}
            {hasValidFiles && (
              <Button
                onClick={() => handleUpload()}
                disabled={disabled || isUploading}
                className="flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload {stats.pending} Files</span>
                  </>
                )}
              </Button>
            )}

            {/* Retry Button */}
            {hasErrors && !isUploading && (
              <Button
                onClick={retryFailedUploads}
                variant="outline"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Failed ({stats.error})</span>
              </Button>
            )}

            {/* Clear Button */}
            {allComplete && (
              <Button
                onClick={clearFiles}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <span>Clear All</span>
              </Button>
            )}
          </div>

          {/* Upload Stats */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.total > 0 && (
              <div className="flex items-center space-x-4">
                {stats.success > 0 && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{stats.success} uploaded</span>
                  </div>
                )}
                {stats.error > 0 && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{stats.error} failed</span>
                  </div>
                )}
                {stats.uploading > 0 && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{stats.uploading} uploading</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Results Summary */}
      {uploadResults.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                Upload Complete
              </h4>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Successfully uploaded {uploadResults.length} file
                {uploadResults.length !== 1 ? "s" : ""}
              </p>
              {reportId && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  Files have been associated with report: {reportId}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auto-upload indicator */}
      {autoUpload && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Files will be uploaded automatically when selected
        </div>
      )}
    </div>
  );
}

export type { FileUploadWithProgressProps };
