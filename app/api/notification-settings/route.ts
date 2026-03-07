import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/notification-settings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Return existing or default values
  const settings = await prisma.notificationSetting.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json(
    settings ?? {
      userId: user.id,
      emailEnabled: true,
      bedtimeReminder: false,
      bedtimeHour: 22,
      bedtimeMinute: 30,
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
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();

  const updated = await prisma.notificationSetting.upsert({
    where: { userId: user.id },
    update: {
      emailEnabled: body.emailEnabled,
      bedtimeReminder: body.bedtimeReminder,
      bedtimeHour: body.bedtimeHour,
      bedtimeMinute: body.bedtimeMinute,
      poorSleepAlert: body.poorSleepAlert,
      streakAlert: body.streakAlert,
    },
    create: {
      userId: user.id,
      emailEnabled: body.emailEnabled ?? true,
      bedtimeReminder: body.bedtimeReminder ?? false,
      bedtimeHour: body.bedtimeHour ?? 22,
      bedtimeMinute: body.bedtimeMinute ?? 30,
      poorSleepAlert: body.poorSleepAlert ?? true,
      streakAlert: body.streakAlert ?? true,
    },
  });

  return NextResponse.json(updated);
}
