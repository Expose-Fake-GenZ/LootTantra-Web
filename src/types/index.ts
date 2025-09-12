// Platform Model
export interface Platform {
  id: string;
  name: string;
  description: string;
  category: string;
  contentCount: number;
  createdAt: Date;
  updatedAt: Date;
  platformUrl: string;
}

// Content Model
export interface ContentItem {
  id: string;
  platformId: string;
  title: string;
  description: string;
  category: "vandalism" | "violence";
  evidenceFiles: EvidenceFile[];
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
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
