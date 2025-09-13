import {
  PutCommand,
  GetCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient, tableNames } from "./aws-config";
import { v4 as uuidv4 } from "uuid";
import type { ContentItem, Platform } from "@/types";

// ------- Platform service --------
// Create
export async function createPlatform(
  data: Omit<Platform, "id" | "createdAt" | "updatedAt">
): Promise<Platform> {
  const item: Platform = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("the item", item);

  await docClient.send(
    new PutCommand({
      TableName: tableNames.platforms,
      Item: item,
    })
  );

  return item;
}

// Get
export async function getPlatformById(id: string): Promise<Platform | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableNames.platforms,
      Key: { id },
    })
  );
  return (result.Item as Platform) || null;
}

// List
export async function listPlatforms({
  limit = 50,
  lastEvaluatedKey,
  category,
}: {
  limit?: number;
  lastEvaluatedKey?: any;
  category?: string;
} = {}) {
  const command = category
    ? new QueryCommand({
        TableName: tableNames.platforms,
        IndexName: "CategoryIndex",
        KeyConditionExpression: "category = :category",
        ExpressionAttributeValues: { ":category": category },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    : new ScanCommand({
        TableName: tableNames.platforms,
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      });

  const result = await docClient.send(command);

  return {
    platforms: (result.Items as Platform[]) || [],
    lastEvaluatedKey: result.LastEvaluatedKey,
    count: result.Count || 0,
  };
}

// Update
export async function updatePlatform(
  id: string,
  updates: Partial<Platform>
): Promise<Platform> {
  const updateExpression = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (key !== "id" && key !== "createdAt") {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  }

  updateExpression.push("#updatedAt = :updatedAt");
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = new Date();

  const result = await docClient.send(
    new UpdateCommand({
      TableName: tableNames.platforms,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes as Platform;
}

// Delete
export async function deletePlatform(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: tableNames.platforms,
      Key: { id },
    })
  );
}

// ------------ Report service ---------

// Create
export async function createReport(
  data: Omit<ContentItem, "id" | "createdAt" | "updatedAt" | "status">
): Promise<ContentItem> {
  const item: ContentItem = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
  };

  await docClient.send(
    new PutCommand({
      TableName: tableNames.reports,
      Item: item,
    })
  );

  return item;
}

// Get
export async function getReportById(id: string): Promise<ContentItem | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableNames.reports,
      Key: { id },
    })
  );
  return (result.Item as ContentItem) || null;
}

// Get by platform
export async function getReportsByPlatform(
  platformId: string,
  {
    limit = 50,
    lastEvaluatedKey,
  }: { limit?: number; lastEvaluatedKey?: any } = {}
) {
  const command = new QueryCommand({
    TableName: tableNames.reports,
    IndexName: "PlatformIndex",
    KeyConditionExpression: "platformId = :platformId",
    ExpressionAttributeValues: { ":platformId": platformId },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
    ScanIndexForward: false,
  });

  const result = await docClient.send(command);
  return {
    reports: (result.Items as ContentItem[]) || [],
    lastEvaluatedKey: result.LastEvaluatedKey,
    count: result.Count || 0,
  };
}

// List
export async function listReports({
  limit = 50,
  lastEvaluatedKey,
  status,
  category,
}: {
  limit?: number;
  lastEvaluatedKey?: any;
  status?: string;
  category?: string;
} = {}) {
  const command = status
    ? new QueryCommand({
        TableName: tableNames.reports,
        IndexName: "StatusIndex",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": status },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    : new ScanCommand({
        TableName: tableNames.reports,
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      });

  const result = await docClient.send(command);
  return {
    reports: (result.Items as ContentItem[]) || [],
    lastEvaluatedKey: result.LastEvaluatedKey,
    count: result.Count || 0,
  };
}

// Update
export async function updateReport(
  id: string,
  updates: Partial<ContentItem>
): Promise<ContentItem> {
  const updateExpression = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (key !== "id" && key !== "createdAt") {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  }

  updateExpression.push("#updatedAt = :updatedAt");
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = new Date();

  const result = await docClient.send(
    new UpdateCommand({
      TableName: tableNames.reports,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes as ContentItem;
}

// Delete
export async function deleteReport(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: tableNames.reports,
      Key: { id },
    })
  );
}
