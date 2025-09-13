"use client";

import { useState, useEffect, useMemo } from "react";
import { ReportList, FilePreview } from "@/components/content";
import { FilterMenu } from "@/components/ui";
import type { FilterOption, SortOption } from "@/components/ui/FilterMenu";
import { ContentItem } from "@/types";
import { useRouter } from "next/navigation";

export default function ContentList({ reports }: { reports: ContentItem[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    type: string;
    filename: string;
    reportId?: string;
    fileIndex?: number;
  } | null>(null);

  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category/status filter
    if (filterBy !== "all") {
      if (filterBy === "vandalism" || filterBy === "violence") {
        filtered = filtered.filter((report) => report.category === filterBy);
      } else if (
        filterBy === "approved" ||
        filterBy === "pending" ||
        filterBy === "rejected"
      ) {
        filtered = filtered.filter((report) => report.status === filterBy);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
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
        case "category":
          return a?.category?.localeCompare(b?.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reports, searchTerm, filterBy, sortBy]);

  const handleLoadMore = async () => {
    setLoading(true);
    // Simulate loading more data
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo purposes, we'll just show that there's no more data
    setHasMore(false);
    setLoading(false);
  };

  const handlePreview = (
    url: string,
    type: string,
    filename: string,
    reportId?: string,
    fileIndex?: number
  ) => {
    setPreviewFile({
      url,
      type,
      filename,
      reportId,
      fileIndex,
    });
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    { value: "all", label: "All Reports" },
    { value: "vandalism", label: "Vandalism" },
    { value: "violence", label: "Violence" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  const sortOptions: SortOption[] = [
    { value: "newest", label: "Recently Updated" },
    { value: "oldest", label: "Oldest First" },
    { value: "title", label: "Title A-Z" },
    { value: "category", label: "Category" },
  ];

  return (
    <div>
      {/* Filters */}
      <FilterMenu
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search reports..."
        filterOptions={filterOptions}
        selectedFilter={filterBy}
        onFilterChange={setFilterBy}
        sortOptions={sortOptions}
        selectedSort={sortBy}
        onSortChange={setSortBy}
        totalCount={reports.length}
        filteredCount={filteredAndSortedReports.length}
        itemType="reports"
        showReportAdd
        onReportAdd={() => router.push("/submit-evidence")}
      />

      {/* Report List */}
      <ReportList
        reports={filteredAndSortedReports}
        loading={loading}
        onPreview={handlePreview}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
      />

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview
          isOpen={!!previewFile}
          onClose={handleClosePreview}
          url={previewFile.url}
          filename={previewFile.filename}
          type={previewFile.type}
          allFiles={
            previewFile.reportId
              ? reports.find((r) => r.id === previewFile.reportId)
                  ?.evidenceFiles || []
              : []
          }
          currentIndex={previewFile.fileIndex || 0}
          onNavigate={(index) => {
            if (previewFile.reportId) {
              const report = reports.find((r) => r.id === previewFile.reportId);
              if (
                report &&
                report.evidenceFiles &&
                report.evidenceFiles[index]
              ) {
                const file = report.evidenceFiles[index];
                setPreviewFile({
                  url: file.url,
                  type: file.type,
                  filename: file.filename,
                  reportId: previewFile.reportId,
                  fileIndex: index,
                });
              }
            }
          }}
        />
      )}
    </div>
  );
}
