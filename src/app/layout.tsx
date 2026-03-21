import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
      <body className={inter.variable} style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, sans-serif' }}>
        <ConfettiProvider>
          {children}
        </ConfettiProvider>
      </body>
    </html>
  );
}
