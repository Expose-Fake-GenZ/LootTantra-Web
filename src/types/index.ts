// Platform Model
export interface Platform {
  id: string;
  name: string;
  description: string;
  platformType: string;
  // contentCount: number;
  dateCreated: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  platformUrl: string;
}

export interface PlatformFormData {
  name: string;
  platformType: string;
  description: string;
  dateCreated: string;
  platformUrl: string;
}

export interface ReportFormData {
  title: string;
  category: string;
  description: string;
  dateOccurred: string;
  supportingUrl?: string;
  name?: string;
  email?: string;
  evidenceFiles: FileProps[];
}

export interface FileProps {
  filename: string;
  s3Key: string;
  size: number;
  type: string;
  url: string;
}

// Content Model
export interface ContentItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  category: string;
  description: string;
  dateOccurred: string;
  supportingUrl?: string;
  name?: string;
  email?: string;
  evidenceFiles: FileProps[];
  status: "pending" | "approved" | "rejected";
}

// Evidence File Model
export interface EvidenceFile {
  id: string;
  contentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  awsUrl: string;
  uploadedAt: Date;
}

// API Response Types
export interface PlatformResponse {
  platforms: Platform[];
  total: number;
}

export interface ContentResponse {
  content: ContentItem[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Request Types
export interface CreatePlatformRequest {
  name: string;
  description: string;
  category: string;
}

export interface CreateContentRequest {
  platformId: string;
  title: string;
  description: string;
  evidenceFiles: File[];
  category: "vandalism" | "violence";
}

// Upload Response
export interface UploadResponse {
  fileUrls: string[];
  uploadIds: string[];
}

// Error Response
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
