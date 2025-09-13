import { Platform, ContentItem } from "@/types";
import platformsData from "@/data/platforms.json";
import reportsData from "@/data/reports.json";

// Transform raw JSON data to typed interfaces
// export function getPlatformsData(): Platform[] {
//   return platformsData.map((platform) => ({
//     ...platform,
//     createdAt: new Date(platform.createdAt),
//     updatedAt: new Date(platform.createdAt),
//   }));
// }

// export function getReportsData(): ContentItem[] {
//   return reportsData.map((report) => ({
//     ...report,
//     category: report.category as "vandalism" | "violence", // Type assertion for category
//     status: report.status as "pending" | "approved" | "rejected", // Type assertion for status
//     createdAt: new Date(report.createdAt),
//     updatedAt: new Date(report.updatedAt),
//     evidenceFiles: report.evidenceFiles.map((file) => ({
//       ...file,
//       uploadedAt: new Date(file.uploadedAt),
//     })),
//   }));
// }

// Server-side data fetching functions for optimal performance
export function getFilteredPlatforms({
  data = [],
  search = "",
  platformType = "all",
  sortBy = "updated",
  page = 1,
  limit = 10,
}: {
  data: Platform[];
  search?: string;
  platformType?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  let platforms = data;

  // Apply search filter
  if (search) {
    platforms = platforms.filter(
      (platform) =>
        platform?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        platform?.description?.toLowerCase().includes(search?.toLowerCase())
    );
  }

  // Apply category filter
  if (platformType !== "all") {
    platforms = platforms.filter(
      (platform) => platform.platformType === platformType
    );
  }

  // Apply sorting
  platforms.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "updated":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      default:
        return 0;
    }
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPlatforms = platforms.slice(startIndex, endIndex);

  // Get unique categories
  const platformTypes = Array.from(
    new Set(data.map((p) => p.platformType))
  ).filter(Boolean);

  return {
    platforms: paginatedPlatforms,
    pagination: {
      page,
      limit,
      total: platforms.length,
      totalPages: Math.ceil(platforms.length / limit),
      hasMore: endIndex < platforms.length,
    },
    platformTypes,
    total: platforms.length,
  };
}

export function getFilteredReports({
  data = [],
  search = "",
  category = "all",
  status = "all",
  sortBy = "newest",
  page = 1,
  limit = 10,
}: {
  data: ContentItem[];
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  let reports = data;

  // Apply search filter
  if (search) {
    reports = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply category filter
  if (category !== "all") {
    reports = reports.filter((report) => report.category === category);
  }

  // Apply status filter
  if (status !== "all") {
    reports = reports.filter((report) => report.status === status);
  }

  // Apply sorting
  reports.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReports = reports.slice(startIndex, endIndex);

  return {
    reports: paginatedReports,
    pagination: {
      page,
      limit,
      total: reports.length,
      totalPages: Math.ceil(reports.length / limit),
      hasMore: endIndex < reports.length,
    },
    total: reports.length,
  };
}
