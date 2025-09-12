"use client";

import { useState, useEffect } from "react";
import { ReportList, FilePreview } from "@/components/content";
import { ContentItem } from "@/types";

export default function ContentSection() {
  const [reports, setReports] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    type: string;
    name?: string;
    reportId?: string;
    fileIndex?: number;
  } | null>(null);

  // Mock data with real images from Unsplash and other sources
  const mockReports: ContentItem[] = [
    {
      id: "1",
      platformId: "platform-1",
      title: "Inappropriate Content Removal",
      description:
        "This report documents the removal of legitimate content that was flagged inappropriately. The content was educational in nature and did not violate any community guidelines, yet it was removed without proper review.",
      category: "vandalism",
      status: "approved",
      evidenceFiles: [
        {
          id: "file-1",
          contentId: "1",
          fileName: "screenshot-before.png",
          fileType: "image/png",
          fileSize: 1024000,
          awsUrl:
            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-15T10:30:00Z"),
        },
        {
          id: "file-2",
          contentId: "1",
          fileName: "screenshot-after.png",
          fileType: "image/png",
          fileSize: 956000,
          awsUrl:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-15T10:35:00Z"),
        },
        {
          id: "file-3",
          contentId: "1",
          fileName: "email-correspondence.pdf",
          fileType: "application/pdf",
          fileSize: 245000,
          awsUrl: "#",
          uploadedAt: new Date("2024-01-15T11:00:00Z"),
        },
      ],
      createdAt: new Date("2024-01-15T10:00:00Z"),
      updatedAt: new Date("2024-01-15T11:30:00Z"),
    },
    {
      id: "2",
      platformId: "platform-2",
      title: "Harassment Campaign Documentation",
      description:
        "Evidence of coordinated harassment targeting specific users. Multiple accounts were involved in systematic harassment that violated platform policies but was not adequately addressed by moderation.",
      category: "violence",
      status: "pending",
      evidenceFiles: [
        {
          id: "file-4",
          contentId: "2",
          fileName: "harassment-video-evidence.mp4",
          fileType: "video/mp4",
          fileSize: 15728640, // ~15MB
          awsUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          uploadedAt: new Date("2024-01-20T14:15:00Z"),
        },
        {
          id: "file-5",
          contentId: "2",
          fileName: "harassment-messages.png",
          fileType: "image/png",
          fileSize: 2048000,
          awsUrl:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-20T14:20:00Z"),
        },
        {
          id: "file-6",
          contentId: "2",
          fileName: "user-profiles.png",
          fileType: "image/png",
          fileSize: 1536000,
          awsUrl:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&h=700&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-20T14:25:00Z"),
        },
      ],
      createdAt: new Date("2024-01-20T14:00:00Z"),
      updatedAt: new Date("2024-01-20T14:30:00Z"),
    },
    {
      id: "3",
      platformId: "platform-1",
      title: "Shadow Banning Investigation",
      description:
        "Documentation of suspected shadow banning practices where content visibility was artificially reduced without notification. Analytics data shows dramatic drops in engagement that correlate with specific topics.",
      category: "vandalism",
      status: "approved",
      evidenceFiles: [
        {
          id: "file-6",
          contentId: "3",
          fileName: "analytics-before.png",
          fileType: "image/png",
          fileSize: 1800000,
          awsUrl:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=900&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-25T09:00:00Z"),
        },
        {
          id: "file-7",
          contentId: "3",
          fileName: "analytics-after.png",
          fileType: "image/png",
          fileSize: 1750000,
          awsUrl:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-25T09:05:00Z"),
        },
        {
          id: "file-8",
          contentId: "3",
          fileName: "engagement-data.csv",
          fileType: "text/csv",
          fileSize: 125000,
          awsUrl: "#",
          uploadedAt: new Date("2024-01-25T09:10:00Z"),
        },
      ],
      createdAt: new Date("2024-01-25T08:30:00Z"),
      updatedAt: new Date("2024-01-25T10:00:00Z"),
    },
    {
      id: "4",
      platformId: "platform-3",
      title: "Data Privacy Violation",
      description:
        "Report documenting unauthorized data collection and sharing practices. User data was collected without consent and shared with third parties in violation of privacy policies.",
      category: "vandalism",
      status: "approved",
      evidenceFiles: [
        {
          id: "file-9",
          contentId: "4",
          fileName: "privacy-settings.png",
          fileType: "image/png",
          fileSize: 1200000,
          awsUrl:
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1000&h=800&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-28T16:00:00Z"),
        },
        {
          id: "file-10",
          contentId: "4",
          fileName: "data-export.png",
          fileType: "image/png",
          fileSize: 1800000,
          awsUrl:
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=900&fit=crop&crop=center",
          uploadedAt: new Date("2024-01-28T16:05:00Z"),
        },
      ],
      createdAt: new Date("2024-01-28T15:30:00Z"),
      updatedAt: new Date("2024-01-28T17:00:00Z"),
    },
    {
      id: "5",
      platformId: "platform-4",
      title: "Algorithmic Bias Evidence",
      description:
        "Documentation of systematic bias in content recommendation algorithms that suppress certain viewpoints while promoting others, creating an unfair information landscape.",
      category: "vandalism",
      status: "pending",
      evidenceFiles: [
        {
          id: "file-11",
          contentId: "5",
          fileName: "algorithm-analysis.png",
          fileType: "image/png",
          fileSize: 2200000,
          awsUrl:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1400&h=1000&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-01T12:00:00Z"),
        },
        {
          id: "file-12",
          contentId: "5",
          fileName: "code-analysis.png",
          fileType: "image/png",
          fileSize: 1900000,
          awsUrl:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-01T12:05:00Z"),
        },
      ],
      createdAt: new Date("2024-02-01T11:30:00Z"),
      updatedAt: new Date("2024-02-01T13:00:00Z"),
    },
    {
      id: "6",
      platformId: "platform-5",
      title: "Coordinated Inauthentic Behavior",
      description:
        "Evidence of bot networks and fake accounts being used to manipulate public opinion and spread misinformation on sensitive topics.",
      category: "violence",
      status: "approved",
      evidenceFiles: [
        {
          id: "file-13",
          contentId: "6",
          fileName: "bot-network.png",
          fileType: "image/png",
          fileSize: 1600000,
          awsUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-05T09:30:00Z"),
        },
        {
          id: "file-14",
          contentId: "6",
          fileName: "fake-accounts.png",
          fileType: "image/png",
          fileSize: 1400000,
          awsUrl:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&h=700&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-05T09:35:00Z"),
        },
        {
          id: "file-15",
          contentId: "6",
          fileName: "activity-patterns.png",
          fileType: "image/png",
          fileSize: 1800000,
          awsUrl:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1300&h=900&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-05T09:40:00Z"),
        },
      ],
      createdAt: new Date("2024-02-05T09:00:00Z"),
      updatedAt: new Date("2024-02-05T10:30:00Z"),
    },
    {
      id: "7",
      platformId: "platform-6",
      title: "Misinformation Campaign Analysis",
      description:
        "Comprehensive analysis of a coordinated misinformation campaign targeting election integrity. Multiple fake news sources were identified spreading identical false narratives across social media platforms.",
      category: "violence",
      status: "approved",
      evidenceFiles: [
        {
          id: "file-16",
          contentId: "7",
          fileName: "news-comparison.png",
          fileType: "image/png",
          fileSize: 2100000,
          awsUrl:
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-10T11:00:00Z"),
        },
        {
          id: "file-17",
          contentId: "7",
          fileName: "social-media-posts.png",
          fileType: "image/png",
          fileSize: 1800000,
          awsUrl:
            "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1000&h=700&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-10T11:05:00Z"),
        },
      ],
      createdAt: new Date("2024-02-10T10:30:00Z"),
      updatedAt: new Date("2024-02-10T12:00:00Z"),
    },
    {
      id: "8",
      platformId: "platform-7",
      title: "Content Moderation Inconsistency",
      description:
        "Documentation of inconsistent content moderation policies where similar content receives different treatment based on the creator's follower count or verification status.",
      category: "vandalism",
      status: "pending",
      evidenceFiles: [
        {
          id: "file-18",
          contentId: "8",
          fileName: "moderation-examples.png",
          fileType: "image/png",
          fileSize: 1500000,
          awsUrl:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1100&h=800&fit=crop&crop=center",
          uploadedAt: new Date("2024-02-12T14:30:00Z"),
        },
      ],
      createdAt: new Date("2024-02-12T14:00:00Z"),
      updatedAt: new Date("2024-02-12T15:30:00Z"),
    },
  ];

  // Simulate API loading
  useEffect(() => {
    const loadReports = async () => {
      // setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReports(mockReports);
      setLoading(false);
    };

    loadReports();
  }, [mockReports]);

  const handleLoadMore = async () => {
    setLoading(true);
    // Simulate loading more data
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo purposes, we'll just show that there's no more data
    setHasMore(false);
    setLoading(false);
  };

  const handlePreview = (
    fileUrl: string,
    fileType: string,
    fileName?: string,
    reportId?: string,
    fileIndex?: number
  ) => {
    setPreviewFile({
      url: fileUrl,
      type: fileType,
      name: fileName,
      reportId,
      fileIndex,
    });
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  return (
    <section
      id="content"
      className="bg-white py-16 transition-colors duration-300 dark:bg-gray-900"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Recent Reports
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Browse through documented incidents with verified evidence and
            supporting materials.
          </p>
          <div className="bg-primary-red mx-auto mt-6 h-1 w-24"></div>
        </div>

        {/* Report List */}
        <ReportList
          reports={reports}
          loading={loading}
          onPreview={handlePreview}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />

        {/* File Preview Modal */}
        {previewFile && (
          <FilePreview
            isOpen={!!previewFile}
            onClose={handleClosePreview}
            fileUrl={previewFile.url}
            fileName={previewFile.name}
            fileType={previewFile.type}
            allFiles={
              previewFile.reportId
                ? reports.find((r) => r.id === previewFile.reportId)
                    ?.evidenceFiles || []
                : []
            }
            currentIndex={previewFile.fileIndex || 0}
            onNavigate={(index) => {
              if (previewFile.reportId) {
                const report = reports.find(
                  (r) => r.id === previewFile.reportId
                );
                if (
                  report &&
                  report.evidenceFiles &&
                  report.evidenceFiles[index]
                ) {
                  const file = report.evidenceFiles[index];
                  setPreviewFile({
                    url: file.awsUrl,
                    type: file.fileType,
                    name: file.fileName,
                    reportId: previewFile.reportId,
                    fileIndex: index,
                  });
                }
              }
            }}
          />
        )}
      </div>
    </section>
  );
}
