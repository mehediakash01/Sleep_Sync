"use client";
import Link from "next/link";
import { Home, BarChart3, Bed, Settings } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { href: "/dashboard", label: "Overview", icon: <Home size={18} /> },
  { href: "/dashboard/sleep-tracker", label: "Sleep Tracker", icon: <Bed size={18} /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed lg:static z-40 w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white h-full p-6"
      >
        <h2 className="text-2xl font-bold mb-10 tracking-wide">SleepSync</h2>

        <nav className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-blue-500 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}
