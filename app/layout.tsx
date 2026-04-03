import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import { Providers } from "@/Providers";
import { LayoutWrapper } from "@/Components/LayoutWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Design system typography fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SleepSync - AI-Powered Sleep Tracking",
  description: "Track your sleep, build streaks, and get AI-powered insights for better rest.",
  keywords: "sleep tracking, sleep quality, sleep insights, sleep analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} antialiased overflow-x-hidden`}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="top-center" reverseOrder={false} />
          <SpeedInsights/>
        </Providers>
      </body>
    </html>
  );
}
