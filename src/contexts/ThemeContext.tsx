"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as Theme;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = savedTheme || systemTheme;

    console.log("Theme initialization:", {
      savedTheme,
      systemTheme,
      initialTheme,
      htmlClasses: document.documentElement.className,
    });

    setTheme(initialTheme);

    // Apply theme to document
    document.documentElement.classList.remove("dark"); // Always remove first
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

    console.log("After theme init:", document.documentElement.className);
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (!mounted) return;

    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggling from", theme, "to", newTheme);

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Always remove the class first, then add if needed
    document.documentElement.classList.remove("dark");
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

    console.log(
      "Theme toggled to:",
      newTheme,
      "HTML classes:",
      document.documentElement.className
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
