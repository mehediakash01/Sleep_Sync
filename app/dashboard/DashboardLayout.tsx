"use client";


import DashNavbar from "@/Components/DashNavbar";
import Sidebar from "@/Components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 py-44">
      {/* Sidebar (hidden on small screens) */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <DashNavbar setIsOpen={setIsOpen} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
