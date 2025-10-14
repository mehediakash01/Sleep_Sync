"use client";

import DashNavbar from "@/Components/DashNavbar";
import Sidebar from "@/Components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen">
      {isOpen && <Sidebar closeSidebar={() => setIsOpen(false)} />}

      <div className="flex flex-col flex-1">
        <DashNavbar toggleSidebar={toggleSidebar} /> 
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
