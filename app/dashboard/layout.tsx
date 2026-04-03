"use client";

import DashNavbar from "@/Components/DashNavbar";
import Sidebar from "@/Components/Sidebar";
import BedtimeReminderCheck from "@/Components/BedtimeReminderCheck";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="premium-page flex min-h-screen text-[var(--app-text)]">
      <BedtimeReminderCheck />
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashNavbar />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
