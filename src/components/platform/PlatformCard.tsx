"use client";
import { Card } from "@/components/ui";
import { Platform } from "@/types";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PlatformCardProps {
  platform: Platform;
  onClick?: () => void;
}

export default function PlatformCard({ platform, onClick }: PlatformCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className="hover:border-primary-red group cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="space-y-4">
        {/* Platform Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <h3 className="group-hover:text-primary-red text-xl font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
                {platform.name}
              </h3>
              <ExternalLink className="text-primary-red h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
            <span className="bg-primary-red inline-block rounded-full px-3 py-1 text-xs font-medium text-white">
              {platform.platformType}
            </span>
          </div>
          <AlertTriangle className="text-primary-red h-6 w-6 flex-shrink-0" />
        </div>

        {/* Platform Description */}
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          {platform.description}
        </p>

        {/* Status Indicator */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-red h-2 w-2 animate-pulse rounded-full"></div>
            <span className="text-xs text-gray-600 transition-colors duration-300 dark:text-gray-400">
              Active monitoring
            </span>
          </div>
          <span className="text-xs text-gray-600 transition-colors duration-300 dark:text-gray-400">
            Created {formatDate(new Date(platform.dateCreated))}
          </span>
        </div>
      </div>
    </Card>
  );
}
