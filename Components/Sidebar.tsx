"use client";

import LoggedOutBtn from "@/Action/LoggedOutBtn";
import NotificationBell from "@/Components/NotificationBell";
import {
  BarChart3,
  Clock3,
  Flame,
  Home,
  MoonStar,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Sleep Log", href: "/dashboard/sleepTracking", icon: Sparkles },
  { name: "Insights", href: "/dashboard/sleepInsights", icon: BarChart3 },
  { name: "History", href: "/dashboard/sleepHistory", icon: Clock3 },
  { name: "Streaks", href: "/dashboard/streak", icon: Flame },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-[290px] flex-col border-r border-[var(--app-line)] bg-[var(--app-surface-muted)]/90 px-5 py-6 backdrop-blur-2xl lg:flex">
      <Link href="/" className="flex items-center gap-3 rounded-[24px] border border-[var(--app-line)] bg-white/5 px-4 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)] shadow-[0_0_24px_rgba(0,229,194,0.16)]">
          <MoonStar className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-[#9BC5FF]">SLEEPSYNC</p>
          <p className="text-sm text-[var(--app-text-muted)]">Dashboard workspace</p>
        </div>
      </Link>

      <div className="mt-6 rounded-[28px] border border-[var(--app-line)] bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[#9BC5FF]">Tonight</p>
        <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">92</p>
        <p className="mt-2 text-sm leading-7 text-[var(--app-text-muted)]">
          Recovery is trending upward. Keep your bedtime within the same 20-minute window.
        </p>
      </div>

      <nav className="mt-6 flex-1 space-y-2">
        {menuItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[var(--app-accent-strong)]/12 text-[var(--app-text)] shadow-[inset_0_0_0_1px_rgba(0,229,194,0.18)]"
                  : "text-[var(--app-text-muted)] hover:bg-white/6 hover:text-[var(--app-text)]"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  isActive ? "bg-[var(--app-accent-strong)]/14 text-[var(--app-accent-strong)]" : "bg-white/5"
                }`}
              >
                <Icon size={16} />
              </span>
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex items-center justify-between rounded-[24px] border border-[var(--app-line)] bg-white/5 px-4 py-4">
        <div>
          <p className="text-sm font-medium text-[var(--app-text)]">Notifications</p>
          <p className="text-xs text-[var(--app-text-muted)]">Stay on top of reminders</p>
        </div>
        <NotificationBell />
      </div>

      <div className="mt-4">
        <LoggedOutBtn />
      </div>
    </aside>
  );
}
