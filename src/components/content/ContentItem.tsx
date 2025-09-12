"use client";
import { Card } from "@/components/ui";
import { ContentItem as ContentItemType } from "@/types";
import { Calendar, FileText, Image, Video, Download, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

interface ContentItemProps {
  content: ContentItemType;
  onPreview?: (fileUrl: string, fileType: string) => void;
}

export default function ContentItem({ content, onPreview }: ContentItemProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (fileId: string) => {
    setImageErrors((prev) => new Set(prev).add(fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return Image;
    if (fileType.startsWith("video/")) return Video;
    return FileText;
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
    <Card className="space-y-4">
      {/* Content Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-primary-black mb-2 text-lg font-semibold transition-colors duration-300 dark:text-white">
            {content.title}
          </h3>
          <div className="mb-3 flex flex-wrap gap-2">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ${getCategoryColor(content.category)}`}
            >
              {content.category}
            </span>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ${getStatusColor(content.status)}`}
            >
              {content.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content Description */}
      <p className="text-primary-black-light leading-relaxed transition-colors duration-300 dark:text-gray-300">
        {content.description}
      </p>

      {/* Evidence Files */}
      {content.evidenceFiles && content.evidenceFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-primary-black text-sm font-medium transition-colors duration-300 dark:text-white">
            Evidence Files ({content.evidenceFiles.length})
          </h4>

          {/* Image Preview Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {content.evidenceFiles
              .filter((file) => file.fileType.startsWith("image/"))
              .slice(0, 4)
              .map((file) => (
                <div
                  key={file.id}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-colors duration-300 dark:bg-gray-700"
                  onClick={() => onPreview?.(file.awsUrl, file.fileType)}
                >
                  {!imageErrors.has(file.id) ? (
                    <img
                      src={file.awsUrl}
                      alt={file.fileName}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={() => handleImageError(file.id)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black transition-all duration-200">
                    <Eye className="h-6 w-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
          </div>

          {/* File List */}
          <div className="space-y-2">
            {content.evidenceFiles.map((file) => {
              const FileIcon = getFileIcon(file.fileType);
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-300 dark:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-primary-black text-sm font-medium transition-colors duration-300 dark:text-white">
                        {file.fileName}
                      </p>
                      <p className="text-primary-black-light text-xs transition-colors duration-300 dark:text-gray-400">
                        {file.fileType} •{" "}
                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.fileType.startsWith("image/") && (
                      <button
                        onClick={() => onPreview?.(file.awsUrl, file.fileType)}
                        className="rounded-lg bg-white p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <a
                      href={file.awsUrl}
                      download={file.fileName}
                      className="rounded-lg bg-white p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Footer */}
      <div className="text-primary-black-light flex items-center justify-between border-t border-gray-200 pt-4 text-sm transition-colors duration-300 dark:border-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDate(content.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>Updated {formatDate(content.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
