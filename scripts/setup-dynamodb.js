#!/usr/bin/env node

/**
 * DynamoDB Table Setup Script
 * Creates the required DynamoDB tables with proper indexes
 */

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  CreateTableCommand,
  DescribeTableCommand,
  ListTablesCommand,
} = require("@aws-sdk/client-dynamodb");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const tableConfigs = [
  {
    name: process.env.DYNAMODB_TABLE_PLATFORMS,
    schema: {
      TableName: process.env.DYNAMODB_TABLE_PLATFORMS,
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH", // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "category",
          AttributeType: "S",
        },
        {
          AttributeName: "updatedAt",
          AttributeType: "S",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "CategoryIndex",
          KeySchema: [
            {
              AttributeName: "category",
              KeyType: "HASH",
            },
            {
              AttributeName: "updatedAt",
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  },
  {
    name: process.env.DYNAMODB_TABLE_REPORTS,
    schema: {
      TableName: process.env.DYNAMODB_TABLE_REPORTS,
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH", // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "platformId",
          AttributeType: "S",
        },
        {
          AttributeName: "status",
          AttributeType: "S",
        },
        {
          AttributeName: "createdAt",
          AttributeType: "S",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "PlatformIndex",
          KeySchema: [
            {
              AttributeName: "platformId",
              KeyType: "HASH",
            },
            {
              AttributeName: "createdAt",
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: "StatusIndex",
          KeySchema: [
            {
              AttributeName: "status",
              KeyType: "HASH",
            },
            {
              AttributeName: "createdAt",
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  },
  {
    name: process.env.DYNAMODB_TABLE_EVIDENCE,
    schema: {
      TableName: process.env.DYNAMODB_TABLE_EVIDENCE,
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH", // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "reportId",
          AttributeType: "S",
        },
        {
          AttributeName: "createdAt",
          AttributeType: "S",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "ReportIndex",
          KeySchema: [
            {
              AttributeName: "reportId",
              KeyType: "HASH",
            },
            {
              AttributeName: "createdAt",
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  },
];

async function tableExists(tableName) {
  try {
    const command = new DescribeTableCommand({ TableName: tableName });
    await client.send(command);
    return true;
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      return false;
    }
    throw error;
  }
}

async function createTable(config) {
  console.log(`Creating table: ${config.name}`);

  try {
    const command = new CreateTableCommand(config.schema);
    const result = await client.send(command);
    console.log(`✅ Table ${config.name} created successfully`);
    return result;
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log(`⚠️  Table ${config.name} already exists`);
    } else {
      console.error(`❌ Failed to create table ${config.name}:`, error.message);
      throw error;
    }
  }
}

async function waitForTable(tableName) {
  console.log(`Waiting for table ${tableName} to become active...`);

  let attempts = 0;
  const maxAttempts = 30; // 5 minutes max wait time

  while (attempts < maxAttempts) {
    try {
      const command = new DescribeTableCommand({ TableName: tableName });
      const result = await client.send(command);

      if (result.Table.TableStatus === "ACTIVE") {
        console.log(`✅ Table ${tableName} is now active`);
        return;
      }

      console.log(`⏳ Table ${tableName} status: ${result.Table.TableStatus}`);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    } catch (error) {
      console.error(`Error checking table status:`, error.message);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  throw new Error(
    `Table ${tableName} did not become active within the timeout period`
  );
}

async function setupTables() {
  console.log("🚀 Setting up DynamoDB tables...\n");

  // Validate environment variables
  const requiredVars = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "DYNAMODB_TABLE_PLATFORMS",
    "DYNAMODB_TABLE_REPORTS",
    "DYNAMODB_TABLE_EVIDENCE",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missing.join(", ")
    );
    console.error("Please check your .env.local file");
    process.exit(1);
  }

  try {
    // List existing tables
    const listCommand = new ListTablesCommand({});
    const existingTables = await client.send(listCommand);
    console.log(
      "📋 Existing tables:",
      existingTables.TableNames?.join(", ") || "None"
    );
    console.log("");

    // Create tables
    for (const config of tableConfigs) {
      if (await tableExists(config.name)) {
        console.log(`✅ Table ${config.name} already exists`);
      } else {
        await createTable(config);
        await waitForTable(config.name);
      }
      console.log("");
    }

    console.log("🎉 All tables are ready!");
    console.log("\nTable configuration:");
    tableConfigs.forEach((config) => {
      console.log(`  - ${config.name}`);
      console.log(`    Primary Key: id (String)`);
      if (config.schema.GlobalSecondaryIndexes) {
        console.log(
          `    Indexes: ${config.schema.GlobalSecondaryIndexes.map((gsi) => gsi.IndexName).join(", ")}`
        );
      }
    });
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupTables();
}

module.exports = { setupTables, tableExists, createTable };
