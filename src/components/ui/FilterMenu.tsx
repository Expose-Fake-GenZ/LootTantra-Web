"use client";

import { Search, Filter, Grid, List, FileText, Shield } from "lucide-react";
import { Button } from ".";

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

interface FilterMenuProps {
  // Search
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;

  // Filter
  filterOptions: FilterOption[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  showFilterIcon?: boolean;

  // Sort
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (sort: string) => void;

  // View mode (optional)
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showViewToggle?: boolean;

  // Results
  totalCount: number;
  filteredCount: number;
  itemType: string; // "reports", "platforms", etc.

  showPlatformAdd?: boolean;
  onPlatformAdd?: () => void;

  showReportAdd?: boolean;
  onReportAdd?: () => void;
}

export default function FilterMenu({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions,
  selectedFilter,
  onFilterChange,
  showFilterIcon = true,
  sortOptions,
  selectedSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  showViewToggle = false,
  totalCount,
  filteredCount,
  itemType,
  showPlatformAdd,
  onPlatformAdd,
  showReportAdd,
  onReportAdd,
}: FilterMenuProps) {
  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="focus:ring-primary-red w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            {showFilterIcon && (
              <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
            <select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="focus:ring-primary-red rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="focus:ring-primary-red rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          {showViewToggle && viewMode && onViewModeChange && (
            <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-primary-red text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-primary-red text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          )}

          {showPlatformAdd && (
            <Button onClick={onPlatformAdd} size="sm">
              <Shield className="mr-2 h-5 w-5" />
              Submit Platform
            </Button>
          )}

          {showReportAdd && (
            <Button onClick={onReportAdd} size="sm">
              <Shield className="mr-2 h-5 w-5" />
              Submit Evidence
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredCount} of {totalCount} {itemType}
        </p>
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="text-primary-red text-sm hover:text-red-700"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
}
