import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/lib/authOptions";

function parseBedtimeTarget(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);

  return {
    hour: Number.isFinite(hour) ? hour : 22,
    minute: Number.isFinite(minute) ? minute : 30,
  };
}

function clampTimePart(value: unknown, min: number, max: number, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(numeric)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numeric));
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

// GET /api/notification-settings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      bedtimeTarget: true,
    },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const fallbackBedtime = parseBedtimeTarget(user.bedtimeTarget);

  // Return existing or default values
  const settings = await prisma.notificationSetting.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json(
    settings
      ? {
          ...settings,
          bedtimeHour: settings.bedtimeHour ?? fallbackBedtime.hour,
          bedtimeMinute: settings.bedtimeMinute ?? fallbackBedtime.minute,
        }
      : {
          userId: user.id,
          emailEnabled: true,
          bedtimeReminder: false,
          bedtimeHour: fallbackBedtime.hour,
          bedtimeMinute: fallbackBedtime.minute,
          poorSleepAlert: true,
          streakAlert: true,
        }
  );
}

// PUT /api/notification-settings
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      bedtimeTarget: true,
    },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const fallbackBedtime = parseBedtimeTarget(user.bedtimeTarget);
  const existing = await prisma.notificationSetting.findUnique({
    where: { userId: user.id },
  });

  const emailEnabled = toBoolean(body.emailEnabled, existing?.emailEnabled ?? true);
  const bedtimeReminder = toBoolean(
    body.bedtimeReminder,
    existing?.bedtimeReminder ?? false
  );
  const poorSleepAlert = toBoolean(
    body.poorSleepAlert,
    existing?.poorSleepAlert ?? true
  );
  const streakAlert = toBoolean(body.streakAlert, existing?.streakAlert ?? true);
  const bedtimeHour = clampTimePart(
    body.bedtimeHour,
    0,
    23,
    existing?.bedtimeHour ?? fallbackBedtime.hour
  );
  const bedtimeMinute = clampTimePart(
    body.bedtimeMinute,
    0,
    59,
    existing?.bedtimeMinute ?? fallbackBedtime.minute
  );

  const updated = await prisma.notificationSetting.upsert({
    where: { userId: user.id },
    update: {
      emailEnabled,
      bedtimeReminder,
      bedtimeHour,
      bedtimeMinute,
      poorSleepAlert,
      streakAlert,
    },
    create: {
      userId: user.id,
      emailEnabled,
      bedtimeReminder,
      bedtimeHour,
      bedtimeMinute,
      poorSleepAlert,
      streakAlert,
    },
  });

  return NextResponse.json(updated);
}
