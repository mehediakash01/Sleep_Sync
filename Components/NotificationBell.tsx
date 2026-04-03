"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        const count = data.filter((item: { isRead: boolean }) => !item.isRead).length;
        setUnreadCount(count);
      } catch {
        // no-op
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/notification"
      aria-label="Open notifications"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 text-[var(--app-text-muted)] transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:text-[var(--app-text)]"
    >
      <Bell size={18} />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--app-accent-strong)] px-1 text-[10px] font-bold text-[#062019]"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
