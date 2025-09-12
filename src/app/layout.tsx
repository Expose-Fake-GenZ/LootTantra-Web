import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LootTantra - Platform Reporting System",
  description:
    "A platform for reporting and documenting instances of vandalism and violence across various platforms with supporting evidence.",
  keywords: [
    "platform reporting",
    "vandalism",
    "violence",
    "evidence",
    "documentation",
  ],
  authors: [{ name: "LootTantra Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-white font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
