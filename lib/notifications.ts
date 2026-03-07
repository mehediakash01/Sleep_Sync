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
