"use client";

import { ContentItem as ContentItemType } from "@/types";
import ReportCard from "./ReportCard";
import { EmptyState, Loading } from "@/components/ui";
import { FileText } from "lucide-react";

interface ReportListProps {
  reports: ContentItemType[];
  loading?: boolean;
  onPreview?: (
    url: string,
    type: string,
    filename: string,
    reportId?: string,
    fileIndex?: number
  ) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ReportList({
  reports,
  loading = false,
  onPreview,
  onLoadMore,
  hasMore = false,
}: ReportListProps) {
  if (reports.length === 0 && !loading) {
    return (
      <EmptyState
        icon={FileText}
        title="No Reports Available"
        description="There are no incident reports to display at this time."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Reports Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportCard key={report.id} content={report} onPreview={onPreview} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-primary-red hover:bg-primary-red-dark disabled:bg-primary-red/50 rounded-lg px-6 py-3 font-medium text-white transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loading size="sm" />
                <span>Loading...</span>
              </div>
            ) : (
              "Load More Reports"
            )}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && reports.length === 0 && (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Loading reports..." />
        </div>
      )}
    </div>
  );
}
