"use client";
import { useState, useMemo } from "react";
import { ContentItem as ContentItemType } from "@/types";
import ContentItem from "./ContentItem";
import { EmptyState } from "@/components/ui";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  FileText,
  SearchX,
} from "lucide-react";

interface ContentListProps {
  content: ContentItemType[];
  platformId?: string;
  onPreview?: (fileUrl: string, fileType: string) => void;
}

type SortOption = "newest" | "oldest" | "title" | "category";
type FilterOption =
  | "all"
  | "vandalism"
  | "violence"
  | "approved"
  | "pending"
  | "rejected";

export default function ContentList({
  content,
  platformId,
  onPreview,
}: ContentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedContent = useMemo(() => {
    let filtered = content;

    // Apply platform filter if specified
    if (platformId) {
      filtered = filtered.filter((item) => item.platformId === platformId);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category/status filter
    if (filterBy !== "all") {
      if (filterBy === "vandalism" || filterBy === "violence") {
        filtered = filtered.filter((item) => item.category === filterBy);
      } else {
        filtered = filtered.filter((item) => item.status === filterBy);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "newest":
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "oldest":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [content, platformId, searchTerm, sortBy, filterBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (content.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No Content Available"
        description="There are no content reports to display at this time."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:border-primary-red focus:ring-primary-red w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-500 transition-colors duration-300 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="focus:border-primary-red focus:ring-primary-red rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-300 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">All Content</option>
              <option value="vandalism">Vandalism</option>
              <option value="violence">Violence</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="focus:border-primary-red focus:ring-primary-red rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-300 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-primary-black-light text-sm transition-colors duration-300 dark:text-gray-400">
        Showing {filteredAndSortedContent.length} of {content.length} content
        reports
      </div>

      {/* Content Grid */}
      {filteredAndSortedContent.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredAndSortedContent.map((item) => (
            <ContentItem key={item.id} content={item} onPreview={onPreview} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No Matching Content"
          description="No content reports match your current search and filter criteria."
        />
      )}
    </div>
  );
}
