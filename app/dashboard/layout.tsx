"use client";

import DashNavbar from "@/Components/DashNavbar";
import Sidebar from "@/Components/Sidebar";
;

export default function Layout({ children }: { children: React.ReactNode }) {
 

  return (
    <div className="flex h-screen">
     <Sidebar></Sidebar>
      <div className="flex flex-col flex-1">
        <DashNavbar />
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
