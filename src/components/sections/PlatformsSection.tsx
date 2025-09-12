"use client";

import { useState, useEffect } from "react";
import { Platform } from "@/types";
import { PlatformList } from "@/components/platform";
import { Loading } from "@/components/ui";

export default function PlatformsSection() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Mock data - will be replaced with real API calls
  const mockPlatforms: Platform[] = [
    {
      id: "1",
      name: "Platform Alpha",
      description:
        "Social media platform with reported incidents of harassment and content manipulation. Multiple verified cases of coordinated attacks against users.",
      category: "Social Media",
      contentCount: 12,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Platform Beta",
      description:
        "Gaming platform with community issues including toxic behavior, doxxing incidents, and inadequate moderation responses.",
      category: "Gaming",
      contentCount: 8,
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      name: "Platform Gamma",
      description:
        "Forum platform with moderation concerns, including censorship of legitimate discussions and biased enforcement of community guidelines.",
      category: "Forum",
      contentCount: 15,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-13"),
    },
    {
      id: "4",
      name: "Platform Delta",
      description:
        "Video sharing platform with issues related to content monetization manipulation and creator harassment campaigns.",
      category: "Video Sharing",
      contentCount: 23,
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-12"),
    },
    {
      id: "5",
      name: "Platform Epsilon",
      description:
        "Professional networking platform with reported cases of fake profiles, spam campaigns, and data privacy violations.",
      category: "Professional",
      contentCount: 7,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-11"),
    },
    {
      id: "6",
      name: "Platform Zeta",
      description:
        "Messaging platform with end-to-end encryption concerns and reports of coordinated misinformation campaigns.",
      category: "Messaging",
      contentCount: 19,
      createdAt: new Date("2023-12-28"),
      updatedAt: new Date("2024-01-10"),
    },
  ];

  // Simulate API loading
  useEffect(() => {
    const loadPlatforms = async () => {
      // setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPlatforms(mockPlatforms);
      setLoading(false);
    };

    loadPlatforms();
  }, [mockPlatforms]);

  const handleLoadMore = async () => {
    setLoading(true);
    // Simulate loading more data
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo purposes, we'll just show that there's no more data
    setHasMore(false);
    setLoading(false);
  };

  return (
    <section
      id="platforms"
      className="bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-800"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-primary-black mb-4 text-3xl font-bold sm:text-4xl">
            Reported Platforms
          </h2>
          <p className="text-primary-black-light mx-auto max-w-2xl text-lg">
            Browse documented incidents across various digital platforms with
            verified evidence and detailed reports.
          </p>
          <div className="bg-primary-red mx-auto mt-6 h-1 w-24"></div>
        </div>

        {/* Platform List */}
        {loading && platforms.length === 0 ? (
          <Loading size="lg" text="Loading platforms..." className="py-12" />
        ) : (
          <PlatformList
            platforms={platforms}
            loading={loading}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        )}
      </div>
    </section>
  );
}
