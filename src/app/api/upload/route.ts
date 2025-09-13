/**
 * File Upload API Route
 * Handles file uploads to AWS S3 with validation and error handling
 */

import { NextRequest, NextResponse } from "next/server";
import { uploadFile, validateFile, generateFileKey } from "../../../lib/s3";

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Processing file upload request...");

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const reportId = formData.get("reportId") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    console.log(
      `📁 Processing ${files.length} files for report: ${reportId || "standalone"}`
    );

    const uploadResults = [];
    const errors = [];

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        console.log(`🔍 Validating file: ${file.name} (${file.size} bytes)`);

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          errors.push({
            filename: file.name,
            error: validation.error,
          });
          continue;
        }

        // Generate unique S3 key
        const s3Key = generateFileKey(file.name, "evidence");
        console.log(`🔑 Generated S3 key: ${s3Key}`);

        // Upload to S3
        const uploadResult = await uploadFile(file, s3Key, {
          originalName: file.name,
          reportId: reportId || "",
          uploadedBy: "user", // TODO: Get from authentication
        });

        console.log(`✅ File uploaded successfully: ${uploadResult.url}`);

        uploadResults.push({
          filename: file.name,
          size: uploadResult.size,
          type: uploadResult.contentType,
          url: uploadResult.url,
          s3Key: uploadResult.key,
        });
      } catch (error) {
        console.error(`❌ Failed to upload file ${file.name}:`, error);
        errors.push({
          filename: file.name,
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    // Prepare response
    const response = {
      success: uploadResults.length > 0,
      uploaded: uploadResults.length,
      failed: errors.length,
      files: uploadResults,
      errors: errors.length > 0 ? errors : undefined,
    };

    const statusCode = uploadResults.length > 0 ? 200 : 400;

    console.log(
      `📊 Upload complete: ${uploadResults.length} success, ${errors.length} errors`
    );

    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error("❌ Upload API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle presigned URL generation for client-side uploads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const contentType = searchParams.get("contentType");

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType parameters" },
        { status: 400 }
      );
    }

    // Validate file type
    const mockFile = { name: filename, type: contentType, size: 0 } as File;
    const validation = validateFile(mockFile);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Generate S3 key and presigned URL
    const s3Key = generateFileKey(filename, "evidence");

    // Import presigned URL function
    const { getPresignedUploadUrl } = await import("../../../lib/s3");
    const presignedData = await getPresignedUploadUrl(s3Key, contentType);

    return NextResponse.json({
      uploadUrl: presignedData.uploadUrl,
      key: presignedData.key,
      fields: presignedData.fields,
    });
  } catch (error) {
    console.error("❌ Presigned URL generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate upload URL",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
