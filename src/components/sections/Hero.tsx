"use client";

import { Button } from "@/components/ui";
import { Shield, FileText, Users } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-screen items-center bg-gradient-to-br from-white via-gray-50 to-gray-100 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-content mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex min-h-[80vh] flex-col justify-center text-center">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              <span className="mb-2 block">Exposing Platform</span>
              <span className="text-primary-red">Vandalism & Violence</span>
            </h1>

            {/* Motto/Subtitle */}
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600 sm:text-2xl dark:text-gray-300">
              Documenting incidents across digital platforms with verifiable
              evidence to promote transparency and accountability.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              size="lg"
              onClick={() => scrollToSection("content")}
              className="relative z-10 w-full px-8 py-4 text-lg font-semibold sm:w-auto"
            >
              <FileText className="mr-2 h-5 w-5" />
              View Reports
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("submit")}
              className="relative z-10 w-full px-8 py-4 text-lg font-semibold sm:w-auto"
            >
              <Shield className="mr-2 h-5 w-5" />
              Submit Evidence
            </Button>
          </div>

          {/* Stats/Features */}
          <div className="mx-auto mb-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary-red mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Verified Evidence
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All submissions are verified with supporting documentation and
                proof.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-red mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Transparent Reporting
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Clear documentation of incidents with timestamps and context.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-red mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Community Driven
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built by the community, for the community to ensure
                accountability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary-red absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-5 blur-3xl"></div>
        <div className="bg-primary-red absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-5 blur-3xl"></div>
      </div>
    </section>
  );
}
