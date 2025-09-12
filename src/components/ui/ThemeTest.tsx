"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeTest() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <div className="text-sm">
        <p className="text-gray-900 dark:text-white">Current theme: {theme}</p>
        <p className="text-gray-600 dark:text-gray-300">
          HTML classes:{" "}
          {typeof document !== "undefined"
            ? document.documentElement.className
            : "N/A"}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Body classes:{" "}
          {typeof document !== "undefined" ? document.body.className : "N/A"}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Computed body bg:{" "}
          {typeof window !== "undefined"
            ? window.getComputedStyle(document.body).backgroundColor
            : "N/A"}
        </p>
        <button
          onClick={toggleTheme}
          className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Toggle Theme
        </button>

        {/* Test colors */}
        <div className="mt-2 space-y-1">
          <div className="bg-primary-red h-4 w-4 rounded border"></div>
          <div className="h-4 w-4 rounded border bg-red-600"></div>
          <p className="text-primary-red">Custom red text</p>
          <p className="text-red-600">Standard red text</p>
          <p className="text-gray-900 dark:text-white">
            This should change color
          </p>
          <div className="rounded bg-gray-100 p-2 dark:bg-gray-700">
            Background should change
          </div>
        </div>
      </div>
    </div>
  );
}
