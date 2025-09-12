/**
 * Environment configuration utility
 * Centralizes all environment variable access and provides type safety
 */

// Client-side environment variables (prefixed with NEXT_PUBLIC_)
export const clientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// Server-side environment variables
export const serverConfig = {
  baseUrl:
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// Utility functions
export const getBaseUrl = () => {
  // Use server config on server-side, client config on client-side
  if (typeof window === "undefined") {
    return serverConfig.baseUrl;
  }
  return clientConfig.baseUrl;
};

export const getApiUrl = () => {
  // For client-side API calls
  return clientConfig.apiUrl;
};

export const getServerApiUrl = () => {
  // For server-side API calls (SSR, API routes calling other API routes)
  return `${serverConfig.baseUrl}/api`;
};

// Environment validation
export const validateEnvironment = () => {
  const requiredClientVars = ["NEXT_PUBLIC_BASE_URL", "NEXT_PUBLIC_API_URL"];
  const requiredServerVars = ["BASE_URL"];

  const missingVars: string[] = [];

  // Check client-side variables
  requiredClientVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Check server-side variables (only on server)
  if (typeof window === "undefined") {
    requiredServerVars.forEach((varName) => {
      if (!process.env[varName] && !process.env.NEXT_PUBLIC_BASE_URL) {
        missingVars.push(varName);
      }
    });
  }

  if (missingVars.length > 0) {
    console.warn("Missing environment variables:", missingVars);
  }

  return missingVars.length === 0;
};

// Log current configuration (development only)
if (process.env.NODE_ENV === "development") {
  console.log("Environment Configuration:", {
    client: clientConfig,
    server: typeof window === "undefined" ? serverConfig : "N/A (client-side)",
  });
}
