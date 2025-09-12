import { Platform, ContentItem } from "@/types";
import { getApiUrl, getServerApiUrl } from "@/lib/config";

export interface PlatformFilters {
  search?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface ReportFilters {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface PlatformResponse {
  platforms: Platform[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  categories: string[];
  total: number;
}

export interface ReportResponse {
  reports: ContentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  total: number;
}

export async function fetchPlatforms(
  filters: PlatformFilters = {}
): Promise<PlatformResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${getApiUrl()}/platforms?${params.toString()}`,
    {
      cache: "no-store", // Ensure fresh data for dynamic content
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch platforms");
  }

  return response.json();
}

export async function fetchReports(
  filters: ReportFilters = {}
): Promise<ReportResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`${getApiUrl()}/reports?${params.toString()}`, {
    cache: "no-store", // Ensure fresh data for dynamic content
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  return response.json();
}

// Server-side data fetching for initial page load
export async function fetchPlatformsServer(
  filters: PlatformFilters = {}
): Promise<PlatformResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${getServerApiUrl()}/platforms?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch platforms");
  }

  return response.json();
}

export async function fetchReportsServer(
  filters: ReportFilters = {}
): Promise<ReportResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${getServerApiUrl()}/reports?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  return response.json();
}
