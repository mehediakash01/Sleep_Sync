import prisma from "@/prisma/prismaClient";
import {
  sendEmail,
  sleepLoggedTemplate,
  streakTemplate,
  poorSleepTemplate,
  bedtimeReminderTemplate,
} from "./email";

export type NotificationType =
  | "SLEEP_LOGGED"
  | "STREAK"
  | "POOR_SLEEP"
  | "BEDTIME_REMINDER";

interface CreateNotificationParams {
  userId: number;
  userEmail: string;
  type: NotificationType;
  title: string;
  message: string;
  emailHtml?: string;
}

interface BedtimeReminderCandidate {
  userId: number;
  userEmail: string;
  userName: string;
  timezone: string;
  bedtimeHour: number;
  bedtimeMinute: number;
}

interface ReminderSweepResult {
  checked: number;
  sent: number;
}

const REMINDER_WINDOW_MINUTES = 15;
const REMINDER_LEAD_MINUTES = 15;
const REMINDER_FOLLOWUP_MINUTES = 60;

function getTimezoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const formatted = formatter.formatToParts(date);
  const lookup = Object.fromEntries(
    formatted
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    year: lookup.year,
    month: lookup.month,
    day: lookup.day,
    hour: Number(lookup.hour ?? "0"),
    minute: Number(lookup.minute ?? "0"),
  };
}

function getLocalDateKey(date: Date, timeZone: string): string {
  const parts = getTimezoneParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getCircularMinuteDelta(currentMinutes: number, targetMinutes: number): number {
  let delta = currentMinutes - targetMinutes;

  if (delta < -720) {
    delta += 1440;
  } else if (delta > 720) {
    delta -= 1440;
  }

  return delta;
}

function getReminderOccurrenceKey(
  date: Date,
  timeZone: string,
  bedtimeHour: number,
  bedtimeMinute: number
): string | null {
  const parts = getTimezoneParts(date, timeZone);
  const currentMinutes = parts.hour * 60 + parts.minute;
  const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute;
  const delta = getCircularMinuteDelta(currentMinutes, bedtimeMinutes);

  if (delta < -REMINDER_LEAD_MINUTES || delta > REMINDER_FOLLOWUP_MINUTES) {
    return null;
  }

  if (delta >= 0) {
    if (currentMinutes < bedtimeMinutes) {
      return getLocalDateKey(
        new Date(date.getTime() - 24 * 60 * 60 * 1000),
        timeZone
      );
    }

    return getLocalDateKey(date, timeZone);
  }

  if (currentMinutes > bedtimeMinutes) {
    return getLocalDateKey(
      new Date(date.getTime() + 24 * 60 * 60 * 1000),
      timeZone
    );
  }

  return getLocalDateKey(date, timeZone);
}

function getReminderSlot(
  date: Date,
  timeZone: string,
  bedtimeHour: number,
  bedtimeMinute: number
): number | null {
  const parts = getTimezoneParts(date, timeZone);
  const currentMinutes = parts.hour * 60 + parts.minute;
  const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute;
  const delta = getCircularMinuteDelta(currentMinutes, bedtimeMinutes);

  if (delta < -REMINDER_LEAD_MINUTES || delta > REMINDER_FOLLOWUP_MINUTES) {
    return null;
  }

  return Math.floor((delta + REMINDER_LEAD_MINUTES) / REMINDER_WINDOW_MINUTES);
}

function hasReminderForCurrentSlot(
  reminderDate: Date,
  timeZone: string,
  bedtimeHour: number,
  bedtimeMinute: number,
  recentNotifications: Array<{ createdAt: Date }>
): boolean {
  const occurrenceKey = getReminderOccurrenceKey(
    reminderDate,
    timeZone,
    bedtimeHour,
    bedtimeMinute
  );
  const slot = getReminderSlot(reminderDate, timeZone, bedtimeHour, bedtimeMinute);

  if (!occurrenceKey || slot === null) {
    return false;
  }

  return recentNotifications.some((notification) => {
    const notificationOccurrenceKey = getReminderOccurrenceKey(
      notification.createdAt,
      timeZone,
      bedtimeHour,
      bedtimeMinute
    );
    const notificationSlot = getReminderSlot(
      notification.createdAt,
      timeZone,
      bedtimeHour,
      bedtimeMinute
    );

    return (
      notificationOccurrenceKey === occurrenceKey && notificationSlot === slot
    );
  });
}

function parseBedtimeTarget(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);

  return {
    hour: Number.isFinite(hour) ? hour : 22,
    minute: Number.isFinite(minute) ? minute : 30,
  };
}

export async function createNotification({
  userId,
  userEmail,
  type,
  title,
  message,
  emailHtml,
}: CreateNotificationParams) {
  // Always create in-app notification
  await prisma.notification.create({
    data: { userId, type, title, message },
  });

  // Send email if user has email notifications enabled
  const settings = await prisma.notificationSetting.findUnique({
    where: { userId },
  });

  // Default emailEnabled = true if no settings record yet
  const emailEnabled = settings ? settings.emailEnabled : true;

  if (emailEnabled && emailHtml) {
    await sendEmail({ to: userEmail, subject: title, html: emailHtml });
  }

  return { success: true };
}

// ──────────────────────────────────────────
// Convenience creators
// ──────────────────────────────────────────

export async function notifySleepLogged(
  userId: number,
  userEmail: string,
  userName: string,
  duration: number,
  quality: number
) {
  await createNotification({
    userId,
    userEmail,
    type: "SLEEP_LOGGED",
    title: "Sleep log recorded",
    message: `You logged ${duration.toFixed(1)} hrs of sleep with a quality of ${quality}/5.`,
    emailHtml: sleepLoggedTemplate(userName, duration, quality),
  });
}

export async function notifyStreak(
  userId: number,
  userEmail: string,
  userName: string,
  days: number
) {
  const settings = await prisma.notificationSetting.findUnique({
    where: { userId },
  });

  if (settings && !settings.streakAlert) return;

  await createNotification({
    userId,
    userEmail,
    type: "STREAK",
    title: `🔥 ${days}-Day Sleep Streak!`,
    message: `You've logged your sleep for ${days} consecutive days. Keep it up!`,
    emailHtml: streakTemplate(userName, days),
  });
}

export async function notifyPoorSleep(
  userId: number,
  userEmail: string,
  userName: string,
  quality: number
) {
  const settings = await prisma.notificationSetting.findUnique({
    where: { userId },
  });

  // Respect poorSleepAlert setting (default true)
  if (settings && !settings.poorSleepAlert) return;

  await createNotification({
    userId,
    userEmail,
    type: "POOR_SLEEP",
    title: "Poor sleep quality detected",
    message: `Your logged sleep quality was ${quality}/5. Check your AI Coach for improvement tips.`,
    emailHtml: poorSleepTemplate(userName, quality),
  });
}

export async function notifyBedtimeReminder(
  userId: number,
  userEmail: string,
  userName: string
) {
  const settings = await prisma.notificationSetting.findUnique({
    where: { userId },
  });

  if (settings && !settings.bedtimeReminder) return;

  await createNotification({
    userId,
    userEmail,
    type: "BEDTIME_REMINDER",
    title: "🌙 Bedtime reminder",
    message: "It's almost your set bedtime. Time to wind down for a good night's rest!",
    emailHtml: bedtimeReminderTemplate(userName),
  });
}

// ──────────────────────────────────────────
// Streak calculatior
// ──────────────────────────────────────────

export async function computeStreak(userId: number): Promise<number> {
  const logs = await prisma.sleepLog.findMany({
    where: { userId },
    orderBy: { dateOfSession: "desc" },
    select: { dateOfSession: true },
  });

  if (logs.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < logs.length; i++) {
    const prev = new Date(logs[i - 1].dateOfSession);
    const curr = new Date(logs[i].dateOfSession);

    const diffDays = Math.round(
      (prev.setHours(0, 0, 0, 0) - curr.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export async function runBedtimeReminderSweep(
  now: Date = new Date()
): Promise<ReminderSweepResult> {
  const settings = await prisma.notificationSetting.findMany({
    where: {
      bedtimeReminder: true,
    },
    select: {
      userId: true,
      bedtimeHour: true,
      bedtimeMinute: true,
      user: {
        select: {
          email: true,
          name: true,
          timezone: true,
          bedtimeTarget: true,
        },
      },
    },
  });

  const candidates: BedtimeReminderCandidate[] = settings.map((setting) => {
    const fallbackBedtime = parseBedtimeTarget(setting.user.bedtimeTarget);

    return {
      userId: setting.userId,
      userEmail: setting.user.email,
      userName: setting.user.name,
      timezone: setting.user.timezone || "UTC",
      bedtimeHour: setting.bedtimeHour ?? fallbackBedtime.hour,
      bedtimeMinute: setting.bedtimeMinute ?? fallbackBedtime.minute,
    };
  });

  const recentNotifications = await prisma.notification.findMany({
    where: {
      type: "BEDTIME_REMINDER",
      userId: { in: candidates.map((candidate) => candidate.userId) },
      createdAt: {
        gte: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      },
    },
    select: {
      userId: true,
      createdAt: true,
    },
  });

  const notificationsByUser = new Map<number, Array<{ createdAt: Date }>>();
  for (const notification of recentNotifications) {
    const userNotifications = notificationsByUser.get(notification.userId) ?? [];
    userNotifications.push({ createdAt: notification.createdAt });
    notificationsByUser.set(notification.userId, userNotifications);
  }

  let sent = 0;

  for (const candidate of candidates) {
    const reminderKey = getReminderOccurrenceKey(
      now,
      candidate.timezone,
      candidate.bedtimeHour,
      candidate.bedtimeMinute
    );

    if (!reminderKey) {
      continue;
    }

    const alreadySent = hasReminderForCurrentSlot(
      now,
      candidate.timezone,
      candidate.bedtimeHour,
      candidate.bedtimeMinute,
      notificationsByUser.get(candidate.userId) ?? []
    );

    if (alreadySent) {
      continue;
    }

    await notifyBedtimeReminder(
      candidate.userId,
      candidate.userEmail,
      candidate.userName
    );
    sent += 1;

    const userNotifications = notificationsByUser.get(candidate.userId) ?? [];
    userNotifications.push({ createdAt: now });
    notificationsByUser.set(candidate.userId, userNotifications);
  }

  return {
    checked: candidates.length,
    sent,
  };
}
