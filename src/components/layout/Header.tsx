"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Twitter, Mail, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import socials from "@/data/socials.json";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="border-primary-red sticky top-0 z-50 border-b-2 bg-white shadow-sm transition-colors duration-300 dark:bg-gray-900">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary-red flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                LootTantra
              </span>
            </Link>
          </div>

          {/* Desktop Navigation & Social Links */}
          <div className="hidden items-center space-x-6 md:flex">
            <nav className="flex items-center space-x-4">
              <Link
                href="/#platforms"
                className="font-medium text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
              >
                Platforms
              </Link>
              <Link
                href="/submit-evidence"
                className="font-medium text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
              >
                Submit Report
              </Link>
              {process.env.NODE_ENV === "development" && (
                <Link
                  href="/upload-test"
                  className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400"
                >
                  Upload Test
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6 dark:border-gray-700">
              <ThemeToggle />
              <Link
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:contact@loottantra.com"
                className="text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden dark:border-gray-700">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/#platforms"
                className="py-2 font-medium text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Platforms
              </Link>
              <Link
                href="/submit-evidence"
                className="py-2 font-medium text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Submit Report
              </Link>
            </nav>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="mailto:contact@loottantra.com"
                  className="text-gray-600 transition-colors duration-200 hover:text-red-600 dark:text-gray-300"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
