import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const logs = await prisma.sleepLog.findMany({
    where: { userId: user.id },
    orderBy: { dateOfSession: "asc" },
    select: { dateOfSession: true, sleepQuality: true, duration: true },
  });

  if (logs.length === 0) {
    return NextResponse.json({
      currentStreak: 0,
      longestStreak: 0,
      totalNights: 0,
      loggedDates: [],
    });
  }

  // Deduplicate by calendar date (keep latest per day)
  const dateMap = new Map<string, { quality: number; duration: number | null }>();
  for (const log of logs) {
    const key = new Date(log.dateOfSession).toISOString().split("T")[0];
    dateMap.set(key, { quality: log.sleepQuality, duration: log.duration });
  }

  const sortedDates = Array.from(dateMap.keys()).sort();
  const totalNights = sortedDates.length;

  // ── Compute current streak (consecutive days ending today or yesterday) ──
  function toYMD(d: Date) {
    return d.toISOString().split("T")[0];
  }

  const today = toYMD(new Date());
  const yesterday = toYMD(new Date(Date.now() - 86_400_000));

  let currentStreak = 0;
  // Walk backwards from today/yesterday
  let cursor = new Date(
    sortedDates.includes(today)
      ? today
      : sortedDates.includes(yesterday)
      ? yesterday
      : sortedDates[sortedDates.length - 1]
  );

  // Only count streak if the most recent log is today or yesterday
  const mostRecent = sortedDates[sortedDates.length - 1];
  if (mostRecent === today || mostRecent === yesterday) {
    while (dateMap.has(toYMD(cursor))) {
      currentStreak++;
      cursor = new Date(cursor.getTime() - 86_400_000);
    }
  }

  // ── Compute longest streak ──
  let longestStreak = 0;
  let tempStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / 86_400_000
    );
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  // ── Build loggedDates array for heatmap (last 24 weeks) ──
  const loggedDates = sortedDates.map((date) => ({
    date,
    quality: dateMap.get(date)!.quality,
    duration: dateMap.get(date)!.duration,
  }));

  return NextResponse.json({
    currentStreak,
    longestStreak,
    totalNights,
    loggedDates,
  });
}
