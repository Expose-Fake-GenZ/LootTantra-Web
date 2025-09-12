import Link from "next/link";
import { Github, Twitter, Mail, ExternalLink } from "lucide-react";
import socials from "@/data/socials.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white dark:bg-black">
      <div className="max-w-content mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-red flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <span className="text-xl font-bold">LootTantra</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-200">
              Documenting and reporting instances of vandalism and violence
              across platforms with verifiable evidence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-primary-red text-lg font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#platforms"
                  className="hover:text-primary-red text-gray-200 transition-colors duration-200 hover:text-white"
                >
                  View Platforms
                </Link>
              </li>
              <li>
                <Link
                  href="#submit"
                  className="hover:text-primary-red text-gray-200 transition-colors duration-200 hover:text-white"
                >
                  Submit Report
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-primary-red text-gray-200 transition-colors duration-200 hover:text-white"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-primary-red text-lg font-semibold">
              Connect With Us
            </h3>
            <div className="flex space-x-6">
              <Link
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-red rounded-lg p-2 text-gray-200 transition-colors duration-200 hover:bg-gray-800"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-red rounded-lg p-2 text-gray-200 transition-colors duration-200 hover:bg-gray-800"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href={socials.email}
                className="hover:text-primary-red rounded-lg p-2 text-gray-200 transition-colors duration-200 hover:bg-gray-800"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </Link>
            </div>
            <div className="mt-4 text-sm text-gray-200">
              <p>Report issues and contribute to transparency</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-600 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-gray-200">
              © {currentYear} LootTantra. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-200">
              <Link
                href="/privacy"
                className="hover:text-primary-red transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary-red transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
