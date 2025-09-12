"use client";

import { useState } from "react";
import { Platform } from "@/types";
import PlatformCard from "./PlatformCard";
import { Button } from "@/components/ui";
import { Search, Filter, Grid, List, Loader2 } from "lucide-react";

interface PlatformListProps {
  platforms: Platform[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function PlatformList({
  platforms,
  loading = false,
  onLoadMore,
  hasMore = false,
}: PlatformListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "updated" | "reports">(
    "updated",
  );

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(platforms.map((p) => p.category))),
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
    // TODO: Navigate to platform detail page or show modal
    console.log("Platform clicked:", platform.name);
  };

  if (loading && platforms.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-red animate-spin mx-auto mb-4" />
          <p className="text-primary-black-light">Loading platforms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-black-light w-5 h-5" />
              <input
                type="text"
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-black-light" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "updated" | "reports")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
          >
            <option value="updated">Recently Updated</option>
            <option value="name">Name A-Z</option>
            <option value="reports">Most Reports</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-primary-red text-white" : "bg-white text-primary-black-light hover:bg-gray-50"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-primary-red text-white" : "bg-white text-primary-black-light hover:bg-gray-50"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-primary-black-light">
          Showing {filteredPlatforms.length} of {platforms.length} platforms
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-primary-red hover:text-primary-red-dark text-sm"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Platform Grid/List */}
      {filteredPlatforms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-primary-black mb-2">
            No platforms found
          </h3>
          <p className="text-primary-black-light">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            size="lg"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
