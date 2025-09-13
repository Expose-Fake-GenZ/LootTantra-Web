/**
 * S3 Bucket Setup Script
 * Creates the required S3 bucket for file uploads
 */

const {
  S3Client,
  CreateBucketCommand,
  PutBucketCorsCommand,
  HeadBucketCommand,
} = require("@aws-sdk/client-s3");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;

async function checkBucketExists() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}

async function createBucket() {
  try {
    console.log(`Creating S3 bucket: ${bucketName}`);

    const createParams = {
      Bucket: bucketName,
    };

    // Only add LocationConstraint if not us-east-1
    if (region !== "us-east-1") {
      createParams.CreateBucketConfiguration = {
        LocationConstraint: region,
      };
    }

    await s3Client.send(new CreateBucketCommand(createParams));
    console.log(`✅ Bucket ${bucketName} created successfully`);
  } catch (error) {
    if (error.name === "BucketAlreadyOwnedByYou") {
      console.log(`✅ Bucket ${bucketName} already exists and is owned by you`);
    } else {
      throw error;
    }
  }
}

async function configureCORS() {
  try {
    console.log("Configuring CORS for bucket...");

    const corsConfiguration = {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          AllowedOrigins: ["*"], // In production, replace with your domain
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3000,
        },
      ],
    };

    await s3Client.send(
      new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: corsConfiguration,
      })
    );

    console.log("✅ CORS configuration applied successfully");
  } catch (error) {
    console.error("❌ Error configuring CORS:", error.message);
    throw error;
  }
}

async function setupS3() {
  try {
    console.log("🚀 Setting up S3 bucket...");
    console.log(`Bucket name: ${bucketName}`);
    console.log(`Region: ${region}`);

    // Check if bucket exists
    const exists = await checkBucketExists();

    if (exists) {
      console.log(`✅ Bucket ${bucketName} already exists`);
    } else {
      // Create bucket
      await createBucket();
    }

    // Configure CORS
    await configureCORS();

    console.log("🎉 S3 setup completed successfully!");
    console.log("\nYour S3 bucket is ready for file uploads.");
  } catch (error) {
    console.error("❌ Error setting up S3:", error.message);

    if (error.name === "InvalidAccessKeyId") {
      console.error("Please check your AWS_ACCESS_KEY_ID in .env.local");
    } else if (error.name === "SignatureDoesNotMatch") {
      console.error("Please check your AWS_SECRET_ACCESS_KEY in .env.local");
    } else if (error.name === "BucketAlreadyExists") {
      console.error(
        "Bucket name already exists globally. Please choose a different name in .env.local"
      );
    }

    process.exit(1);
  }
}

// Run the setup
setupS3();
