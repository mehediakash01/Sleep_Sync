"use client";

import { AnimatePresence, motion } from "framer-motion";
import LoggedOutBtn from "@/Action/LoggedOutBtn";
import NotificationBell from "./NotificationBell";
import {
  BarChart3,
  Clock3,
  Flame,
  Home,
  Menu,
  MoonStar,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Sleep Log", href: "/dashboard/sleepTracking", icon: Sparkles },
  { name: "Insights", href: "/dashboard/sleepInsights", icon: BarChart3 },
  { name: "History", href: "/dashboard/sleepHistory", icon: Clock3 },
  { name: "Streaks", href: "/dashboard/streak", icon: Flame },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const avatarFallback = useMemo(() => {
    const seed = session?.user?.name || session?.user?.email || "SleepSync";
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`;
  }, [session?.user?.email, session?.user?.name]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--app-line)] bg-[var(--app-surface-muted)]/88 px-4 py-4 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 text-[var(--app-text)]"
            aria-label="Open dashboard menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#9BC5FF]">Dashboard</p>
            <p className="text-sm font-medium text-[var(--app-text)]">SleepSync</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-1 text-xs font-medium text-[var(--app-text-muted)]">
            14 night streak
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-[#020617]/60 backdrop-blur-sm lg:hidden"
              aria-label="Close dashboard menu overlay"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col border-r border-[var(--app-line)] bg-[var(--app-surface-strong)] p-5 text-[var(--app-text)] backdrop-blur-2xl lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)]">
                    <MoonStar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-[0.24em] text-[#9BC5FF]">SLEEPSYNC</p>
                    <p className="text-sm text-[var(--app-text-muted)]">Dashboard workspace</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5"
                  aria-label="Close dashboard menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-[24px] border border-[var(--app-line)] bg-white/5 p-4">
                <Image
                  src={session?.user?.image || avatarFallback}
                  alt="User avatar"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{session?.user?.name || "SleepSync user"}</p>
                  <p className="truncate text-sm text-[var(--app-text-muted)]">{session?.user?.email || "Ready for tonight"}</p>
                </div>
              </div>

              <nav className="mt-6 flex-1 space-y-2">
                {menuItems.map(({ name, href, icon: Icon }) => {
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-[var(--app-accent-strong)]/12 text-[var(--app-text)]"
                          : "text-[var(--app-text-muted)] hover:bg-white/6 hover:text-[var(--app-text)]"
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? "bg-[var(--app-accent-strong)]/14 text-[var(--app-accent-strong)]" : "bg-white/5"}`}>
                        <Icon size={16} />
                      </span>
                      <span>{name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 flex items-center justify-between rounded-[24px] border border-[var(--app-line)] bg-white/5 px-4 py-4">
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-[var(--app-text-muted)]">Sleep reminders and updates</p>
                </div>
                <NotificationBell />
              </div>

              <div className="mt-4">
                <LoggedOutBtn />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
