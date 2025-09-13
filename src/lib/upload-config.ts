/**
 * Client-safe upload configuration
 * Contains file validation and upload settings without AWS dependencies
 */

// File upload configuration
export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "application/pdf",
    "text/plain",
  ],
  allowedExtensions: [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".mp4",
    ".webm",
    ".mov",
    ".pdf",
    ".txt",
  ],
};

// File validation (client-safe)
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > uploadConfig.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds ${uploadConfig.maxFileSize / 1024 / 1024}MB limit`,
    };
  }

  // Check MIME type
  if (!uploadConfig.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Check file extension
  const extension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));
  if (!uploadConfig.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed`,
    };
  }

  return { valid: true };
}

// Generate unique file key (client-safe)
export function generateFileKey(
  originalName: string,
  folder: string = "videos"
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = originalName.substring(originalName.lastIndexOf("."));
  const baseName = originalName.substring(0, originalName.lastIndexOf("."));

  // Sanitize filename
  const sanitizedName = baseName
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);

  return `${folder}/${timestamp}-${randomId}-${sanitizedName}${extension}`;
}
