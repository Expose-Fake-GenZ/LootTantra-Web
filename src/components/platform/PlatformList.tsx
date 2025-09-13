"use client";

import { useState, useMemo } from "react";
import { Platform } from "@/types";
import PlatformCard from "./PlatformCard";
import { Button, FilterMenu } from "@/components/ui";
import type { FilterOption, SortOption } from "@/components/ui/FilterMenu";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlatformListProps {
  platforms: Platform[];
  categories?: string[];
  totalCount?: number;
  showLoadMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function PlatformList({
  platforms,
  categories = [],
  totalCount,
  showLoadMore = false,
  loading = false,
  onLoadMore,
  hasMore = false,
}: PlatformListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("updated");

  const router = useRouter();

  // Get unique categories and create filter options
  const filterOptions: FilterOption[] = useMemo(() => {
    // Use provided categories or extract from platforms
    const availableCategories =
      categories.length > 0
        ? categories
        : Array.from(new Set(platforms.map((p) => p.category)));

    return [
      { value: "all", label: "All Categories" },
      ...availableCategories.map((category) => ({
        value: category,
        label: category,
      })),
    ];
  }, [platforms, categories]);

  const sortOptions: SortOption[] = [
    { value: "updated", label: "Recently Updated" },
    { value: "name", label: "Name A-Z" },
    { value: "reports", label: "Most Reports" },
  ];

  // Filter and sort platforms
  const filteredPlatforms = platforms
    .filter((platform) => {
      const matchesSearch =
        platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || platform.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "reports":
          return b.contentCount - a.contentCount;
        default:
          return 0;
      }
    });

  const handlePlatformClick = (platform: Platform) => {
    // Navigate to the platform's URL in a new tab
    if (platform.platformUrl) {
      window.open(platform.platformUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading && platforms.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="text-primary-red mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-primary-black-light">Loading platforms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Menu */}
      <FilterMenu
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search platforms..."
        filterOptions={filterOptions}
        selectedFilter={selectedCategory}
        onFilterChange={setSelectedCategory}
        sortOptions={sortOptions}
        selectedSort={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        totalCount={totalCount || platforms.length}
        filteredCount={filteredPlatforms.length}
        itemType="platforms"
        showPlatformAdd
        onPlatformAdd={() => router.push("/submit-platform")}
      />

      {/* Platform Grid/List */}
      {filteredPlatforms.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-primary-black mb-2 text-lg font-semibold">
            No platforms found
          </h3>
          <p className="text-primary-black-light">
            Try adjusting your search terms or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {filteredPlatforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              onClick={() => handlePlatformClick(platform)}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {(hasMore || showLoadMore) && (
        <div className="pt-8 text-center">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            size="lg"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Platforms"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
