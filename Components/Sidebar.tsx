"use client";
import LoggedOutBtn from "@/Action/LoggedOutBtn";
import { Home, BarChart2, Users, Clock, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

const menuItems = [
  { name: "Overview",      icon: <Home size={18} />,     href: "/dashboard" },
  { name: "SleepLog",      icon: <Users size={18} />,    href: "/dashboard/sleepTracking" },
  { name: "Sleep Insights",icon: <BarChart2 size={18} />,href: "/dashboard/sleepInsights" },
  { name: "Sleep History", icon: <Clock size={18} />,    href: "/dashboard/sleepHistory" },
  { name: "Streaks",       icon: <Flame size={18} />,   href: "/dashboard/streak" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="lg:flex flex-col h-full hidden">
      <Link href="/">
        <div className="flex items-center justify-center gap-2 pt-6">
          <Image
            src="/images/SleepSync.png"
            alt="sleepSync-logo"
            width={40}
            height={40}
          />
          <h1 className="text-lg font-bold">SleepSync</h1>
        </div>
      </Link>

      <nav className="flex-1 p-4 space-y-1 mt-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#89CFF0]/20 text-[#4a9fc0] font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t pt-4 pb-4 px-4 flex items-center justify-between">
        <LoggedOutBtn />
        <NotificationBell />
      </div>
    </div>
  );
}
