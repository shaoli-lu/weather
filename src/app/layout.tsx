import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import ConfettiProvider from "@/components/ConfettiProvider";

export const metadata: Metadata = {
  title: "SunRise - Global Sunrise & Sunset Tracker",
  description: "Appreciate the beauty of every horizon. Real-time sunrise, sunset, and weather information for major cities worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfettiProvider>
          {children}
        </ConfettiProvider>
      </body>
    </html>
  );
}
