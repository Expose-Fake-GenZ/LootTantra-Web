import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables configuration
  env: {
    // Custom environment variables can be added here if needed
  },

  // Ensure environment variables are available at build time
  experimental: {
    // Enable if you need server-side environment variables in client components
  },

  // Image optimization configuration (for external images)
  images: {
    domains: [
      "localhost",
      "loottantra.com",
      "images.unsplash.com", // For demo images
      "upload.wikimedia.org", // For platform logos
      "assets-global.website-files.com", // For Discord logo
      "sample-videos.com", // For demo videos
      "genz-protest-video-storage.s3.ap-south-1.amazonaws.com",
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
