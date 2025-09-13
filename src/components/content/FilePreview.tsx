"use client";
import { useState, useEffect } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FileProps } from "@/types";
import Image from "next/image";

interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  filename?: string;
  type: string;
  // New props for navigation
  allFiles?: FileProps[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

export default function FilePreview({
  isOpen,
  onClose,
  url,
  filename,
  type,
  allFiles = [],
  currentIndex = 0,
  onNavigate,
}: FilePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setZoom(1);
      setRotation(0);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && onNavigate && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (
        e.key === "ArrowRight" &&
        onNavigate &&
        currentIndex < allFiles.length - 1
      ) {
        onNavigate(currentIndex + 1);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNavigate, currentIndex, allFiles.length]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handlePrevious = () => {
    if (onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleNext = () => {
    if (onNavigate && currentIndex < allFiles.length - 1) {
      onNavigate(currentIndex + 1);
      setZoom(1);
      setRotation(0);
    }
  };

  // Filter to only show image/video files for navigation
  const mediaFiles = allFiles.filter(
    (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
  );
  const canNavigate = mediaFiles.length > 1;

  const renderContent = () => {
    if (type.startsWith("image/")) {
      return (
        <div className="flex h-full w-full items-center justify-center p-4">
          <Image
            src={url}
            alt={filename || "Preview"}
            className="max-h-full max-w-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
            width={300}
            height={300}
          />
        </div>
      );
    }

    if (type.startsWith("video/")) {
      return (
        <div className="flex h-full w-full items-center justify-center p-4">
          <video
            src={url}
            controls
            className="max-h-full max-w-full"
            style={{
              transform: `scale(${zoom})`,
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // For other file types, show download option
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-white/20 p-4 backdrop-blur-sm">
          <Download className="h-12 w-12 text-white/80" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-white">
          Preview not available
        </h3>
        <p className="mb-4 text-white/80">
          This file type cannot be previewed in the browser.
        </p>
        <a
          href={url}
          download={filename}
          className="bg-primary-red inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Glassmorphism Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Navigation Arrows */}
      {canNavigate && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === allFiles.length - 1}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Modal with Glassmorphism */}
      <div className="relative h-full max-h-screen w-full border border-white/20 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-gray-700/30">
        {/* Header with Glassmorphism */}
        <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-white/20 p-4 backdrop-blur-sm dark:border-gray-700/30">
          <div className="flex-1">
            <h2 className="truncate text-lg font-medium text-white">
              {filename || "File Preview"}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <span>{type}</span>
              {canNavigate && (
                <span>
                  • {currentIndex + 1} of {allFiles.length}
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          {type.startsWith("image/") && (
            <div className="mr-4 flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center text-sm text-white/80">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleRotate}
                className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Download and Close */}
          <div className="flex items-center space-x-2">
            <a
              href={url}
              download={filename}
              className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-5rem)] overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
