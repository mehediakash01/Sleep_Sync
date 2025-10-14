import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/Components/Navbar";
import { Footer } from "@/Components/Footer";
import { Toaster } from "react-hot-toast";
import { ClientSessionProvider } from "@/ClientSessionProvider";
import { LayoutWrapper } from "@/Components/LayoutWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SleepSync",
  description: "Track your sleep stay consistent"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
     
       
        <ClientSessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="top-center" reverseOrder={false} />
        </ClientSessionProvider>
      
     
      </body>
    </html>
  );
}
