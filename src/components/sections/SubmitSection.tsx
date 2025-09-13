"use client";

import { Button, Card } from "@/components/ui";
import { Upload, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SubmitSection() {
  return (
    <section
      id="submit"
      className="bg-white py-16 transition-colors duration-300 dark:bg-gray-900"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Submit Evidence
          </h2>
          <p className="text-primary-black-light mx-auto max-w-2xl text-lg dark:text-gray-300">
            Help build transparency by submitting verified evidence of platform
            incidents. All submissions are reviewed for accuracy.
          </p>
          <div className="bg-primary-red mx-auto mt-6 h-1 w-24"></div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Submission Guidelines */}
          <div className="space-y-6">
            <h3 className="text-primary-black mb-6 text-2xl font-semibold dark:text-white">
              Submission Guidelines
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
                <div>
                  <h4 className="text-primary-black font-semibold dark:text-white">
                    Provide Clear Evidence
                  </h4>
                  <p className="text-primary-black-light dark:text-gray-300">
                    Include screenshots, links, or other verifiable proof of the
                    incident.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
                <div>
                  <h4 className="text-primary-black font-semibold dark:text-white">
                    Include Context
                  </h4>
                  <p className="text-primary-black-light dark:text-gray-300">
                    Provide detailed description of what happened, when, and on
                    which platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="text-primary-red mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="text-primary-black font-semibold dark:text-white">
                    Protect Privacy
                  </h4>
                  <p className="text-primary-black-light dark:text-gray-300">
                    Blur or redact personal information that isn&apos;t relevant
                    to the incident.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-500" />
                <div>
                  <h4 className="text-primary-black font-semibold dark:text-white">
                    Review Process
                  </h4>
                  <p className="text-primary-black-light dark:text-gray-300">
                    All submissions undergo verification before being published
                    to ensure accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Form Preview */}
          <Card className="h-fit">
            <div className="space-y-6 text-center">
              <div className="bg-primary-red mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Upload className="h-8 w-8 text-white" />
              </div>

              <div>
                <h3 className="text-primary-black mb-2 text-xl font-semibold dark:text-white">
                  Ready to Submit?
                </h3>
                <p className="text-primary-black-light dark:text-gray-300">
                  Click below to access our secure submission form and help
                  build a more transparent digital environment.
                </p>
              </div>

              <Link href="/submit-evidence">
                <Button size="lg" className="w-full">
                  <Upload className="mr-2 h-5 w-5" />
                  Open Submission Form
                </Button>
              </Link>

              <div className="text-primary-black-light border-t pt-4 text-xs dark:border-gray-700 dark:text-gray-300">
                <p>
                  By submitting, you agree to our verification process and
                  community guidelines.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
