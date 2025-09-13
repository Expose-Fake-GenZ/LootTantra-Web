/**
 * File Upload Test Page
 * Demo page for testing file upload functionality
 */

"use client";

import React, { useState } from "react";
import FileUploadWithProgress from "../../components/ui/FileUploadWithProgress";
import Button from "../../components/ui/Button";

export default function UploadTestPage() {
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [reportId, setReportId] = useState<string>("test-report-123");
  const [autoUpload, setAutoUpload] = useState<boolean>(false);

  const handleUploadComplete = (results: any[]) => {
    console.log("Upload complete:", results);
    setUploadResults(results);
    setError("");
  };

  const handleUploadError = (errorMessage: string) => {
    console.error("Upload error:", errorMessage);
    setError(errorMessage);
  };

  const clearResults = () => {
    setUploadResults([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              File Upload Test
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Test the file upload functionality with AWS S3 integration
            </p>
          </div>

          {/* Configuration */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report ID (optional)
                </label>
                <input
                  type="text"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter report ID to associate files"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoUpload"
                  checked={autoUpload}
                  onChange={(e) => setAutoUpload(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="autoUpload"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Auto-upload files when selected
                </label>
              </div>
            </div>
          </div>

          {/* File Upload Component */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              File Upload
            </h2>

            <FileUploadWithProgress
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              reportId={reportId || undefined}
              maxFiles={5}
              autoUpload={autoUpload}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Upload Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {uploadResults.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Results ({uploadResults.length})
                </h2>
                <Button onClick={clearResults} variant="outline" size="sm">
                  Clear Results
                </Button>
              </div>

              <div className="space-y-3">
                {uploadResults.map((result, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {result.filename}
                        </h3>
                        <div className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <p>Size: {(result.size / 1024).toFixed(1)} KB</p>
                          <p>Type: {result.type}</p>
                          <p>S3 Key: {result.s3Key}</p>
                          {result.evidenceId && (
                            <p>Evidence ID: {result.evidenceId}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          View File →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AWS Health Check */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              AWS Health Check
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Check if AWS services are properly configured and accessible.
            </p>
            <Button
              onClick={() => window.open("/api/health", "_blank")}
              variant="outline"
            >
              Check AWS Health
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
