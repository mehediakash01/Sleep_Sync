"use client";

import { useEffect, useRef } from "react";

/**
 * Invisible component included in the dashboard layout.
 * On mount (and once per day), checks if the current time is within ±30 min
 * of the user's set bedtime and fires a bedtime reminder notification if so.
 */
export default function BedtimeReminderCheck() {
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;

    const check = async () => {
      try {
        // 1. Fetch user's notification settings
        const res = await fetch("/api/notification-settings");
        if (!res.ok) return;
        const settings = await res.json();

        if (
          !settings.bedtimeReminder ||
          settings.bedtimeHour == null ||
          settings.bedtimeMinute == null
        )
          return;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const bedtimeMinutes = settings.bedtimeHour * 60 + settings.bedtimeMinute;
        const diff = Math.abs(currentMinutes - bedtimeMinutes);

        // Only fire within 30 min window approaching bedtime
        if (diff <= 30) {
          // Check if we already sent one today so we don't spam
          const notifRes = await fetch("/api/notifications");
          if (!notifRes.ok) return;
          const notifications = await notifRes.json();

          const today = new Date().toDateString();
          const alreadyFired = notifications.some(
            (n: { type: string; createdAt: string }) =>
              n.type === "BEDTIME_REMINDER" &&
              new Date(n.createdAt).toDateString() === today
          );

          if (!alreadyFired) {
            await fetch("/api/notifications/bedtime-check", { method: "POST" });
          }
        }
      } catch {
        // Silently fail — non-critical feature
      }
    };

    check();
  }, []);

  return null;
}
