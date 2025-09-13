/**
 * Platform Submission Page
 * Main page for users to submit platform
 */

"use client";

import React, { useState } from "react";
import { Layout } from "@/components/layout";
import { Button, Card } from "../../components/ui";
import { ArrowLeft, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { addPlatform } from "../actions/platform-actions";
import { v4 as uuid } from "uuid";

export default function SubmitPage() {
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    platformType: "",
    description: "",
    dateCreated: "",
    platformUrl: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addPlatform(formData);

      alert(
        "Submission successful! Thank you for contributing to platform transparency."
      );

      setError("");
      setFormData({
        name: "",
        platformType: "",
        description: "",
        dateCreated: "",
        platformUrl: "",
      });
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <Link
                href="/#submit"
                className="mb-4 inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Submit Platform
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Help build transparency by reporting platform to advocate
                against vandalism
              </p>
            </div>

            {/* Submission Form */}
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Platform Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Platform Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief, descriptive title for this evidence"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Platform Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Platform Type *
                    </label>
                    <select
                      name="platformType"
                      value={formData.platformType}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Platform type</option>
                      <option value="forum">Forum</option>
                      <option value="portal">Portal</option>
                      <option value="website">Website</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date Created */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date Created *
                    </label>
                    <input
                      type="date"
                      name="dateCreated"
                      value={formData.dateCreated}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Provide a detailed description of what happened, including context and any relevant details..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Platform URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Platform URL
                  </label>
                  <input
                    type="url"
                    name="platformUrl"
                    value={formData.platformUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* File Upload Section */}
                {/* <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Evidence Files *
                  </label>
                  <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                    Upload screenshots, videos, or documents that support your
                    report (at least one file required)
                  </p>

                  <FileUploadWithProgress
                    onUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    maxFiles={5}
                    autoUpload={true}
                  />
                </div> */}

                {/* Error Display */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Submission Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          {error}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Results */}
                {/* {uploadResults.length > 0 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                          Files Uploaded Successfully
                        </h3>
                        <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                          {uploadResults.length} file(s) uploaded and ready for
                          submission
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link href="/#submit">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.name ||
                      !formData.platformUrl ||
                      !formData.description ||
                      !formData.platformType
                    }
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Guidelines */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Submission Guidelines
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <p>Provide clear, verifiable platform</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <p>Include detailed context about the platform</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <p>
                    Protect privacy by redacting personal information not
                    relevant to the platform
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
