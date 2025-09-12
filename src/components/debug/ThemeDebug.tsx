"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeDebug() {
  const { theme, toggleTheme } = useTheme();
  const [htmlClasses, setHtmlClasses] = useState("");

  useEffect(() => {
    const updateClasses = () => {
      setHtmlClasses(document.documentElement.className);
    };

    updateClasses();

    // Watch for changes
    const observer = new MutationObserver(updateClasses);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 rounded-lg border bg-white p-4 shadow-lg dark:bg-gray-800">
      <h3 className="mb-2 font-bold">Theme Debug</h3>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <p>
        HTML classes: <strong>{htmlClasses}</strong>
      </p>
      <button
        onClick={toggleTheme}
        className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
      >
        Toggle Theme
      </button>
      <div className="mt-2 rounded bg-gray-100 p-2 dark:bg-gray-700">
        <p className="text-gray-900 dark:text-white">
          This text should change color
        </p>
      </div>
    </div>
  );
}
