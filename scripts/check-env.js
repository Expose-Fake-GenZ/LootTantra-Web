#!/usr/bin/env node

/**
 * Environment validation script
 * Run this to check if all required environment variables are set
 */

const fs = require("fs");
const path = require("path");

// Load environment variables from files
function loadEnvFile(filePath) {
  try {
    const envFile = fs.readFileSync(filePath, "utf8");
    const lines = envFile.split("\n");

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").replace(/^["']|["']$/g, "");
          process.env[key] = value;
        }
      }
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Load environment files in order of precedence
const envFiles = [".env.local", ".env.production", ".env"];
const loadedFiles = [];

envFiles.forEach((file) => {
  if (loadEnvFile(file)) {
    loadedFiles.push(file);
  }
});

const requiredVars = {
  client: ["NEXT_PUBLIC_BASE_URL", "NEXT_PUBLIC_API_URL"],
  server: [
    "BASE_URL",
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "DYNAMODB_TABLE_PLATFORMS",
    "DYNAMODB_TABLE_REPORTS",
    "DYNAMODB_TABLE_EVIDENCE",
    "S3_BUCKET_NAME",
    "S3_BUCKET_REGION",
  ],
};

function checkEnvironment() {
  console.log("🔍 Checking environment variables...\n");

  if (loadedFiles.length > 0) {
    console.log(`📁 Loaded environment files: ${loadedFiles.join(", ")}\n`);
  } else {
    console.log("⚠️  No environment files found\n");
  }

  let hasErrors = false;

  // Check client-side variables
  console.log("📱 Client-side variables (NEXT_PUBLIC_*):");
  requiredVars.client.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${value}`);
    } else {
      console.log(`  ❌ ${varName}: NOT SET`);
      hasErrors = true;
    }
  });

  console.log("\n🖥️  Server-side variables:");
  requiredVars.server.forEach((varName) => {
    const value = process.env[varName];
    const fallback = process.env.NEXT_PUBLIC_BASE_URL;
    if (value) {
      console.log(`  ✅ ${varName}: ${value}`);
    } else if (fallback) {
      console.log(
        `  ⚠️  ${varName}: NOT SET (using NEXT_PUBLIC_BASE_URL as fallback: ${fallback})`
      );
    } else {
      console.log(`  ❌ ${varName}: NOT SET`);
      hasErrors = true;
    }
  });

  console.log("\n📊 Current environment:");
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || "NOT SET"}`);

  if (hasErrors) {
    console.log("\n❌ Some required environment variables are missing!");
    console.log(
      "💡 Make sure you have the correct .env file for your environment:"
    );
    console.log("   - Development: .env.local");
    console.log("   - Production: .env.production");
    console.log("   - Copy from: .env.example");
    process.exit(1);
  } else {
    console.log("\n✅ All environment variables are properly configured!");
  }
}

checkEnvironment();
