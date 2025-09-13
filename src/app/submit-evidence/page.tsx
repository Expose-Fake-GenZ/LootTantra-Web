/**
 * Evidence Submission Page
 * Main page for users to submit evidence of platform incidents
 */

"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import FileUploadWithProgress from "../../components/ui/FileUploadWithProgress";
import { Button, Card } from "../../components/ui";
import { ArrowLeft, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { addReport } from "../actions/report-actions";
import { FileProps } from "@/types";
import { useRouter } from "next/navigation";

export type fileStatus = "idle" | "pending" | "completed";

export default function SubmitPage() {
  const router = useRouter();

  const [uploadResults, setUploadResults] = useState<FileProps[]>([]);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileStatus, setFileStatus] = useState<fileStatus>("idle");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    dateOccurred: "",
    supportingUrl: "",
    name: "",
    email: "",
    evidenceFiles: [],
  });

  const handleUploadComplete = (results: FileProps[]) => {
    setUploadResults(results);
    setError("");
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

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

    // Check if at least one file is uploaded
    if (uploadResults.length === 0) {
      setError("Please upload at least one evidence file before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would submit the form data along with the uploaded files
      // For now, just simulate a submission

      await addReport({ ...formData, evidenceFiles: uploadResults });
      // Reset form after successful submission
      // setFormData({
      //   title: "",
      //   incidentType: "",
      //   description: "",
      //   dateOccurred: "",
      //   supportingUrl: "",
      //   name: "",
      //   email: "",
      //   evidenceFiles: [],
      // });
      // setUploadResults([]);

      setMessage("Platform submitted Successfully");

      alert("Platform is submitted successfully");

      router.push("/#reports");
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setMessage("");
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
                Submit Evidence
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Help build transparency by reporting platform incidents with
                evidence
              </p>
            </div>

            {!!message && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                  {message}
                </p>
              </div>
            )}

            {/* Submission Form */}
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Evidence Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Evidence Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief, descriptive title for this evidence"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Incident Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Incident Type *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select incident type</option>
                      <option value="genz-protest">GenZ protest</option>
                      <option value="corruption">Corruption</option>
                      <option value="violence">Violence</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date Occurred */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date Occurred *
                    </label>
                    <input
                      type="date"
                      name="dateOccurred"
                      value={formData.dateOccurred}
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

                {/* Supporting URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Supporting URL (optional)
                  </label>
                  <input
                    type="url"
                    name="supportingUrl"
                    value={formData.supportingUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/link-to-evidence"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Optional: Link to additional evidence or source material
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Optional: Provide your name and email if you want updates on
                  your submission
                </p>

                {/* File Upload Section */}
                <div>
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
                    setStatus={setFileStatus}
                  />
                </div>

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
                {uploadResults.length > 0 && (
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
                )}

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
                      !formData.title ||
                      !formData.category ||
                      !formData.description ||
                      !formData.dateOccurred ||
                      fileStatus === "pending"
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
                  <p>
                    Provide clear, verifiable evidence (screenshots, links,
                    documents)
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <p>Include detailed context about what happened and when</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <p>
                    Protect privacy by redacting personal information not
                    relevant to the incident
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <p>All submissions undergo verification before publication</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
