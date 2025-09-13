# AWS Setup Guide

This guide explains how to set up AWS services (DynamoDB and S3) for the LootTantra platform.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured (optional but recommended)
3. Node.js and npm installed

## Required AWS Services

### 1. DynamoDB Tables

- **Platforms Table**: Stores platform information
- **Reports Table**: Stores content reports and incidents
- **Evidence Table**: Stores evidence file metadata

### 2. S3 Bucket

- **Evidence Files Bucket**: Stores uploaded evidence files (images, videos, documents)

## Environment Variables

Add the following variables to your `.env.local` (development) and `.env.production` (production) files:

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# DynamoDB Configuration
DYNAMODB_TABLE_PLATFORMS=loottantra-platforms-dev
DYNAMODB_TABLE_REPORTS=loottantra-reports-dev
DYNAMODB_TABLE_EVIDENCE=loottantra-evidence-dev

# S3 Configuration
S3_BUCKET_NAME=loottantra-evidence-files-dev
S3_BUCKET_REGION=us-east-1
```

## Setup Instructions

### Step 1: Create AWS IAM User

1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the following policies:
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
4. Save the Access Key ID and Secret Access Key

### Step 2: Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://loottantra-evidence-files-dev --region us-east-1

# Set bucket policy for public read access (optional)
aws s3api put-bucket-policy --bucket loottantra-evidence-files-dev --policy file://bucket-policy.json
```

Example bucket policy (`bucket-policy.json`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::loottantra-evidence-files-dev/*"
    }
  ]
}
```

### Step 3: Create DynamoDB Tables

Run the automated setup script:

```bash
npm run setup-db
```

Or create tables manually using AWS CLI:

```bash
# Platforms table
aws dynamodb create-table \
  --table-name loottantra-platforms-dev \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=category,AttributeType=S \
    AttributeName=updatedAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=CategoryIndex,KeySchema=[{AttributeName=category,KeyType=HASH},{AttributeName=updatedAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Reports table
aws dynamodb create-table \
  --table-name loottantra-reports-dev \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=platformId,AttributeType=S \
    AttributeName=status,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=PlatformIndex,KeySchema=[{AttributeName=platformId,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    IndexName=StatusIndex,KeySchema=[{AttributeName=status,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Evidence table
aws dynamodb create-table \
  --table-name loottantra-evidence-dev \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=reportId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=ReportIndex,KeySchema=[{AttributeName=reportId,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Step 4: Test the Setup

1. Start the development server:

   ```bash
   npm run dev:check
   ```

2. Test AWS connectivity:

   ```bash
   npm run aws:health
   ```

3. Or visit: `http://localhost:3000/api/health`

## Table Schemas

### Platforms Table

```typescript
{
  id: string; // Primary key
  name: string;
  description: string;
  platformUrl: string;
  category: string; // GSI partition key
  contentCount: number;
  createdAt: Date;
  updatedAt: Date; // GSI sort key
}
```

### Reports Table

```typescript
{
  id: string;              // Primary key
  platformId: string;      // GSI partition key
  title: string;
  description: string;
  status: string;          // GSI partition key
  category: string;
  evidenceFiles: string[]; // Array of evidence file IDs
  createdAt: Date;         // GSI sort key
  updatedAt: Date;
}
```

### Evidence Table

```typescript
{
  id: string; // Primary key
  reportId: string; // GSI partition key
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  createdAt: Date; // GSI sort key
}
```

## File Upload Configuration

### Supported File Types

- **Images**: JPEG, PNG, GIF, WebP
- **Videos**: MP4, WebM, QuickTime
- **Documents**: PDF, TXT

### File Size Limits

- Maximum file size: 10MB
- Recommended image size: < 5MB
- Recommended video size: < 10MB

### S3 Folder Structure

```
evidence/
├── 2024/
│   ├── 01/
│   │   ├── timestamp-uuid-filename.jpg
│   │   └── timestamp-uuid-filename.mp4
│   └── thumbnails/
│       └── thumb_timestamp-uuid-filename.jpg
└── documents/
    └── timestamp-uuid-filename.pdf
```

## Security Considerations

1. **IAM Permissions**: Use least privilege principle
2. **S3 Bucket Policy**: Configure appropriate access controls
3. **Environment Variables**: Never commit AWS credentials to version control
4. **CORS Configuration**: Set up proper CORS for S3 bucket if needed
5. **Presigned URLs**: Use for secure file access and uploads

## Monitoring and Logging

1. **CloudWatch**: Monitor DynamoDB and S3 metrics
2. **AWS X-Ray**: Trace requests for debugging
3. **Application Logs**: Monitor health check endpoints
4. **Cost Monitoring**: Set up billing alerts

## Troubleshooting

### Common Issues

1. **Access Denied Errors**
   - Check IAM permissions
   - Verify AWS credentials in environment variables

2. **Table Not Found**
   - Run `npm run setup-db` to create tables
   - Check table names in environment variables

3. **S3 Upload Failures**
   - Verify bucket exists and is accessible
   - Check file size and type restrictions

4. **Health Check Failures**
   - Check AWS service status
   - Verify network connectivity
   - Review application logs

### Debug Commands

```bash
# Check environment variables
npm run check-env

# Test AWS connectivity
npm run aws:health

# List DynamoDB tables
aws dynamodb list-tables

# List S3 buckets
aws s3 ls

# Check table status
aws dynamodb describe-table --table-name loottantra-platforms-dev
```

## Production Deployment

For production deployment:

1. Use separate AWS account or environment
2. Update table names and bucket names with `-prod` suffix
3. Configure proper backup and disaster recovery
4. Set up monitoring and alerting
5. Use AWS Secrets Manager for credential management
6. Enable encryption at rest for DynamoDB and S3
