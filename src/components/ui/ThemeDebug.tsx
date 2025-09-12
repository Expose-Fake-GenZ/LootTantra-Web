"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeDebug() {
  const { theme } = useTheme();
  const [htmlClasses, setHtmlClasses] = useState("");

  useEffect(() => {
    const updateClasses = () => {
      setHtmlClasses(document.documentElement.className);
    };

    updateClasses();

    // Update classes whenever they change
    const observer = new MutationObserver(updateClasses);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-black/80 p-4 text-sm text-white">
      <div>Theme Context: {theme}</div>
      <div>HTML Classes: &quot;{htmlClasses}&quot;</div>
      <div>
        Dark Mode Active:{" "}
        {document.documentElement.classList.contains("dark") ? "Yes" : "No"}
      </div>
    </div>
  );
}
