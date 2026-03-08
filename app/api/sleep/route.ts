import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/lib/authOptions";
import {
  notifySleepLogged,
  notifyPoorSleep,
  notifyStreak,
  computeStreak,
  STREAK_MILESTONES,
} from "@/lib/notifications";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const newLog = await prisma.sleepLog.create({
    data: {
      ...data,
      userId: user.id,
      dateOfSession: new Date(data.dateOfSession),
      timeInBed: new Date(data.timeInBed),
      wakeUpTime: new Date(data.wakeUpTime),
    },
  });

  // ── Fire notifications in the background (non-blocking) ──
  (async () => {
    try {
      const duration = newLog.duration ?? 0;
      const quality = newLog.sleepQuality;

      // 1. Always notify sleep logged
      await notifySleepLogged(user.id, user.email, user.name, duration, quality);

      // 2. Poor sleep alert (quality < 3)
      if (quality < 3) {
        await notifyPoorSleep(user.id, user.email, user.name, quality);
      }

      // 3. Streak milestone check
      const streak = await computeStreak(user.id);
      if (STREAK_MILESTONES.includes(streak)) {
        // Avoid duplicate streak notifications for the same milestone
        const alreadyNotified = await prisma.notification.findFirst({
          where: {
            userId: user.id,
            type: "STREAK",
            title: { contains: `${streak}-Day` },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!alreadyNotified) {
          await notifyStreak(user.id, user.email, user.name, streak);
        }
      }
    } catch (err) {
      console.error("[Notifications] Background notification error:", err);
    }
  })();

  return NextResponse.json(newLog);
}
