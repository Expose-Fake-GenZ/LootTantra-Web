/**
 * S3 Utilities
 * Provides file upload, download, and management operations
 */

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, s3Config } from "./aws-config";
import { v4 as uuidv4 } from "uuid";

// Import client-safe configuration
export { uploadConfig, validateFile, generateFileKey } from "./upload-config";

// Upload file to S3
export async function uploadFile(
  file: File | Buffer,
  key: string,
  metadata?: Record<string, string>
): Promise<{
  key: string;
  url: string;
  size: number;
  contentType: string;
}> {
  const contentType =
    file instanceof File ? file.type : "application/octet-stream";
  const size = file instanceof File ? file.size : file.length;

  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
    Body:
      file instanceof File ? new Uint8Array(await file.arrayBuffer()) : file,
    ContentType: contentType,
    Metadata: {
      uploadedAt: new Date().toISOString(),
      ...metadata,
    },
  });

  await s3Client.send(command);

  const url = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;

  return {
    key,
    url,
    size,
    contentType,
  };
}

// Generate presigned URL for secure file access
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Generate presigned URL for file upload (client-side upload)
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300 // 5 minutes default
): Promise<{
  uploadUrl: string;
  key: string;
  fields: Record<string, string>;
}> {
  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    uploadUrl,
    key,
    fields: {
      "Content-Type": contentType,
    },
  };
}

// Check if file exists
export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}

// Get file metadata
export async function getFileMetadata(key: string): Promise<{
  size: number;
  lastModified: Date;
  contentType: string;
  metadata: Record<string, string>;
} | null> {
  try {
    const command = new HeadObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    const result = await s3Client.send(command);

    return {
      size: result.ContentLength || 0,
      lastModified: result.LastModified || new Date(),
      contentType: result.ContentType || "application/octet-stream",
      metadata: result.Metadata || {},
    };
  } catch (error: unknown) {
    if (error.name === "NotFound") {
      return null;
    }
    throw error;
  }
}

// Delete file from S3
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

// List files in a folder
export async function listFiles(
  prefix: string = "",
  maxKeys: number = 1000
): Promise<{
  files: Array<{
    key: string;
    size: number;
    lastModified: Date;
    url: string;
  }>;
  isTruncated: boolean;
  nextContinuationToken?: string;
}> {
  const command = new ListObjectsV2Command({
    Bucket: s3Config.bucketName,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const result = await s3Client.send(command);

  const files = (result.Contents || []).map((object) => ({
    key: object.Key!,
    size: object.Size || 0,
    lastModified: object.LastModified || new Date(),
    url: `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${object.Key}`,
  }));

  return {
    files,
    isTruncated: result.IsTruncated || false,
    nextContinuationToken: result.NextContinuationToken,
  };
}

// Batch delete files
export async function deleteFiles(keys: string[]): Promise<void> {
  // S3 batch delete has a limit of 1000 objects
  const batches = [];
  for (let i = 0; i < keys.length; i += 1000) {
    batches.push(keys.slice(i, i + 1000));
  }

  for (const batch of batches) {
    const deletePromises = batch.map((key) => deleteFile(key));
    await Promise.all(deletePromises);
  }
}

// Health check function
export async function healthCheck(): Promise<{
  s3: boolean;
  bucket: boolean;
  error?: string;
}> {
  try {
    // Test bucket access with a simple list operation
    const command = new ListObjectsV2Command({
      Bucket: s3Config.bucketName,
      MaxKeys: 1,
    });

    await s3Client.send(command);

    return {
      s3: true,
      bucket: true,
    };
  } catch (error: unknown) {
    console.error("S3 health check failed:", error);

    return {
      s3: false,
      bucket: false,
      error: error.message,
    };
  }
}

// Utility function to get file type from extension
export function getFileTypeFromExtension(
  filename: string
): "image" | "video" | "document" | "unknown" {
  const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension)) {
    return "image";
  }

  if ([".mp4", ".webm", ".mov"].includes(extension)) {
    return "video";
  }

  if ([".pdf", ".txt"].includes(extension)) {
    return "document";
  }

  return "unknown";
}

// Generate thumbnail key for images
export function getThumbnailKey(originalKey: string): string {
  const parts = originalKey.split("/");
  const filename = parts.pop()!;
  const folder = parts.join("/");

  return `${folder}/thumbnails/thumb_${filename}`;
}
