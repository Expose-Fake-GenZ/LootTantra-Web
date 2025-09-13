"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { ContentItem as ContentItemType } from "@/types";
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface ReportCardProps {
  content: ContentItemType;
  onPreview?: (
    url: string,
    type: string,
    filename: string,
    reportId?: string,
    fileIndex?: number
  ) => void;
}

export default function ReportCard({ content, onPreview }: ReportCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Filter media files (images and videos)
  const mediaFiles =
    content.evidenceFiles?.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    ) || [];

  const handleImageError = (fileId: string) => {
    setImageErrors((prev) => new Set(prev).add(fileId));
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vandalism":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "violence":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <Card className="hover:border-primary-red group transition-all duration-200 hover:shadow-lg">
      <div className="space-y-4">
        {/* Media Carousel */}
        {mediaFiles.length > 0 && (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            {mediaFiles[currentMediaIndex].type.startsWith("image/") ? (
              !imageErrors.has(mediaFiles[currentMediaIndex].s3Key) ? (
                <Image
                  src={mediaFiles[currentMediaIndex].url}
                  alt={mediaFiles[currentMediaIndex].filename}
                  className="h-full w-full object-cover"
                  onError={() =>
                    handleImageError(mediaFiles[currentMediaIndex].s3Key)
                  }
                  width={300}
                  height={300}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
              )
            ) : (
              <div className="relative h-full w-full">
                <video
                  src={mediaFiles[currentMediaIndex].url}
                  className="h-full w-full object-cover"
                  controls={false}
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
                {/* Video Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="rounded-full bg-white/80 p-3">
                    <Video className="h-6 w-6 text-gray-800" />
                  </div>
                </div>
              </div>
            )}

            {/* Carousel Controls */}
            {mediaFiles.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/70"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/70"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Media Indicators */}
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
                  {mediaFiles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === currentMediaIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Preview Button */}
            <button
              onClick={() =>
                onPreview?.(
                  mediaFiles[currentMediaIndex].url,
                  mediaFiles[currentMediaIndex].type,
                  mediaFiles[currentMediaIndex].filename,
                  content.id,
                  currentMediaIndex
                )
              }
              className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Report Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="group-hover:text-primary-red text-lg font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
              {content.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(content.category)}`}
            >
              {content.category}
            </span>
            {/* <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(content.status)}`}
            >
              {content.status}
            </span> */}
          </div>
        </div>

        {/* Report Description */}
        <p className="line-clamp-3 text-gray-600 dark:text-gray-300">
          {content.description}
        </p>

        {/* Evidence Summary */}
        {content.evidenceFiles && content.evidenceFiles.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>
                {content.evidenceFiles.length} evidence{" "}
                {content.evidenceFiles.length === 1 ? "file" : "files"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(new Date(content.createdAt))}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
