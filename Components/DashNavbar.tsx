"use client";
import { Menu } from "lucide-react";

export default function DashNavbar({ setIsOpen }: { setIsOpen: (v: boolean) => void }) {
  return (
    <header className="flex items-center justify-between bg-white border-b px-4 py-3 shadow-sm">
      <button
        className="lg:hidden text-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>

      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="w-9 h-9 rounded-full border"
        />
      </div>
    </header>
  );
}
