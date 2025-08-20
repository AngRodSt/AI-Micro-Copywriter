import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Text Generator - Professional Copywriting Tool",
  description:
    "Generate professional marketing copy and content with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-gray-50 min-h-screen`}>
        <main className="min-h-screen py-8 px-4">{children}</main>
      </body>
    </html>
  );
}
