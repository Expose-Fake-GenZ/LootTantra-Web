/**
 * AWS Configuration and Client Setup
 * Centralizes AWS SDK configuration for DynamoDB and S3
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

// Validate required environment variables
const requiredEnvVars = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "DYNAMODB_TABLE_PLATFORMS",
  "DYNAMODB_TABLE_REPORTS",
  "DYNAMODB_TABLE_EVIDENCE",
  "S3_BUCKET_NAME",
  "S3_BUCKET_REGION",
];

function validateEnvironment() {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env.local or .env.production file."
    );
  }
}

// Validate environment on module load
validateEnvironment();

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

// DynamoDB Client Setup
const dynamoClient = new DynamoDBClient(awsConfig);
export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 Client Setup
export const s3Client = new S3Client({
  ...awsConfig,
  region: process.env.S3_BUCKET_REGION!,
});

// Table Names
export const tableNames = {
  platforms: process.env.DYNAMODB_TABLE_PLATFORMS!,
  reports: process.env.DYNAMODB_TABLE_REPORTS!,
  evidence: process.env.DYNAMODB_TABLE_EVIDENCE!,
};

// S3 Configuration
export const s3Config = {
  bucketName: process.env.S3_BUCKET_NAME!,
  region: process.env.S3_BUCKET_REGION!,
};

// Export configuration for debugging
export const awsConfigInfo = {
  region: awsConfig.region,
  s3Region: s3Config.region,
  s3Bucket: s3Config.bucketName,
  tables: tableNames,
};
