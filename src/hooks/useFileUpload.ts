"use client";

/**
 * useFileUpload Hook
 * Provides file upload functionality with progress tracking and error handling
 */

import { useState, useCallback } from "react";
import type { FileUploadItem } from "../components/ui/FileUpload";

interface UploadOptions {
  reportId?: string;
  onProgress?: (fileId: string, progress: number) => void;
  onSuccess?: (fileId: string, result: any) => void;
  onError?: (fileId: string, error: string) => void;
}

interface UploadResult {
  filename: string;
  size: number;
  type: string;
  url: string;
  s3Key: string;
  evidenceId?: string;
}

interface UploadResponse {
  success: boolean;
  uploaded: number;
  failed: number;
  files: UploadResult[];
  errors?: Array<{ filename: string; error: string }>;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  // Upload files to server (one by one for individual progress)
  const uploadFiles = useCallback(
    async (
      files: FileUploadItem[],
      options: UploadOptions = {}
    ): Promise<UploadResponse> => {
      const { reportId, onProgress, onSuccess, onError } = options;

      setIsUploading(true);
      setUploadProgress({});

      try {
        // Filter only valid files that are pending
        const validFiles = files.filter((f) => f.status === "pending");

        if (validFiles.length === 0) {
          throw new Error("No valid files to upload");
        }

        const results: UploadResult[] = [];
        const errors: Array<{ filename: string; error: string }> = [];

        // Upload files one by one for individual progress tracking
        for (let i = 0; i < validFiles.length; i++) {
          const fileItem = validFiles[i];

          // Add small delay between uploads (except for first file)
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          try {
            // Create FormData for single file
            const formData = new FormData();
            formData.append("files", fileItem.file);

            if (reportId) {
              formData.append("reportId", reportId);
            }

            // Upload single file with progress tracking
            const result = await new Promise<UploadResult>(
              (resolve, reject) => {
                const xhr = new XMLHttpRequest();

                // Track upload progress for this specific file
                xhr.upload.addEventListener("progress", (event) => {
                  if (event.lengthComputable) {
                    const progress = Math.round(
                      (event.loaded / event.total) * 100
                    );

                    // Update progress for this specific file
                    setUploadProgress((prev) => ({
                      ...prev,
                      [fileItem.id]: progress,
                    }));
                    console.log(
                      `Progress for ${fileItem.file.name} (${fileItem.id}): ${progress}%`
                    );
                    onProgress?.(fileItem.id, progress);
                  }
                });

                // Handle completion
                xhr.addEventListener("load", () => {
                  try {
                    const response: UploadResponse = JSON.parse(
                      xhr.responseText
                    );

                    if (xhr.status >= 200 && xhr.status < 300) {
                      if (response.files && response.files.length > 0) {
                        resolve(response.files[0]);
                      } else {
                        reject(
                          new Error(
                            response.errors?.[0]?.error || "Upload failed"
                          )
                        );
                      }
                    } else {
                      reject(new Error("Upload failed"));
                    }
                  } catch (error) {
                    reject(new Error("Failed to parse response"));
                  }
                });

                // Handle errors
                xhr.addEventListener("error", () => {
                  reject(new Error("Network error during upload"));
                });

                xhr.addEventListener("abort", () => {
                  reject(new Error("Upload was aborted"));
                });

                // Send request
                xhr.open("POST", "/api/upload");
                xhr.send(formData);
              }
            );

            // File uploaded successfully
            results.push(result);
            onSuccess?.(fileItem.id, result);
          } catch (error) {
            // File upload failed
            const errorMessage =
              error instanceof Error ? error.message : "Upload failed";
            errors.push({
              filename: fileItem.file.name,
              error: errorMessage,
            });
            onError?.(fileItem.id, errorMessage);
          }
        }

        // Return combined results
        const response: UploadResponse = {
          success: results.length > 0,
          uploaded: results.length,
          failed: errors.length,
          files: results,
          errors: errors.length > 0 ? errors : undefined,
        };

        return response;
      } catch (error) {
        throw error;
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    []
  );

  // Upload single file with progress
  const uploadSingleFile = useCallback(
    async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
      const fileItem: FileUploadItem = {
        id: `single_${Date.now()}`,
        file,
        status: "pending",
        progress: 0,
      };

      const response = await uploadFiles([fileItem], options);

      if (response.files.length === 0) {
        throw new Error(response.errors?.[0]?.error || "Upload failed");
      }

      return response.files[0];
    },
    [uploadFiles]
  );

  // Get presigned URL for client-side upload
  const getPresignedUrl = useCallback(
    async (
      filename: string,
      contentType: string
    ): Promise<{
      uploadUrl: string;
      key: string;
      fields: Record<string, string>;
    }> => {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get upload URL");
      }

      return response.json();
    },
    []
  );

  // Upload directly to S3 using presigned URL
  const uploadToS3 = useCallback(
    async (
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<string> => {
      // Get presigned URL
      const { uploadUrl, key } = await getPresignedUrl(file.name, file.type);

      // Upload to S3
      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress?.(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // S3 returns the URL in the Location header or construct it
            const s3Url =
              xhr.getResponseHeader("Location") ||
              `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${key}`;
            resolve(s3Url);
          } else {
            reject(new Error("S3 upload failed"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during S3 upload"));
        });

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    },
    [getPresignedUrl]
  );

  return {
    uploadFiles,
    uploadSingleFile,
    uploadToS3,
    getPresignedUrl,
    isUploading,
    uploadProgress,
  };
}

export type { UploadOptions, UploadResult, UploadResponse };
