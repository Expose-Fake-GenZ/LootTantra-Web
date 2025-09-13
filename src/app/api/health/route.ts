/**
 * Health Check API Route
 * Tests connectivity to AWS services (DynamoDB and S3)
 */

import { NextResponse } from "next/server";
import { healthCheck as dynamoHealthCheck } from "../../../lib/dynamodb";
import { healthCheck as s3HealthCheck } from "../../../lib/s3";
import { awsConfigInfo } from "../../../lib/aws-config";

export async function GET() {
  try {
    console.log("🔍 Running health checks...");

    // Run health checks in parallel
    const [dynamoHealth, s3Health] = await Promise.all([
      dynamoHealthCheck().catch((error) => ({
        dynamodb: false,
        tables: { platforms: false, reports: false, evidence: false },
        error: error.message,
      })),
      s3HealthCheck().catch((error) => ({
        s3: false,
        bucket: false,
        error: error.message,
      })),
    ]);

    const overallHealth = dynamoHealth.dynamodb && s3Health.s3;
    const statusCode = overallHealth ? 200 : 503;

    const response = {
      status: overallHealth ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        dynamodb: {
          status: dynamoHealth.dynamodb ? "healthy" : "unhealthy",
          tables: dynamoHealth.tables,
          error: "error" in dynamoHealth ? dynamoHealth.error : undefined,
        },
        s3: {
          status: s3Health.s3 ? "healthy" : "unhealthy",
          bucket: s3Health.bucket,
          error: "error" in s3Health ? s3Health.error : undefined,
        },
      },
      config: {
        region: awsConfigInfo.region,
        s3Region: awsConfigInfo.s3Region,
        s3Bucket: awsConfigInfo.s3Bucket,
        tables: awsConfigInfo.tables,
      },
    };

    console.log("✅ Health check completed:", {
      dynamodb: dynamoHealth.dynamodb,
      s3: s3Health.s3,
      overall: overallHealth,
    });

    return NextResponse.json(response, { status: statusCode });
  } catch (error: unknown) {
    console.error("❌ Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          dynamodb: { status: "unknown", error: "Health check failed" },
          s3: { status: "unknown", error: "Health check failed" },
        },
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
