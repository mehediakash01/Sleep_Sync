import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/lib/authOptions";

const BEDTIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isValidTimezone(value: string): boolean {
  try {
    Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numeric));
}

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    timezone: user.timezone,
    nightlyTarget: user.nightlyTarget,
    bedtimeTarget: user.bedtimeTarget,
    streakGoal: user.streakGoal,
  });
}

export async function PUT(req: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<{
    name: string;
    timezone: string;
    nightlyTarget: number;
    bedtimeTarget: string;
    streakGoal: number;
  }>;

  const nextName =
    typeof body.name === "string" && body.name.trim().length > 1
      ? body.name.trim()
      : user.name;
  const nextTimezone =
    typeof body.timezone === "string" && isValidTimezone(body.timezone)
      ? body.timezone
      : user.timezone;
  const nextNightlyTarget = clampNumber(body.nightlyTarget, 4, 12, user.nightlyTarget);
  const nextBedtimeTarget =
    typeof body.bedtimeTarget === "string" && BEDTIME_PATTERN.test(body.bedtimeTarget)
      ? body.bedtimeTarget
      : user.bedtimeTarget;
  const nextStreakGoal = Math.round(clampNumber(body.streakGoal, 3, 120, user.streakGoal));

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: nextName,
      timezone: nextTimezone,
      nightlyTarget: nextNightlyTarget,
      bedtimeTarget: nextBedtimeTarget,
      streakGoal: nextStreakGoal,
    },
    select: {
      name: true,
      email: true,
      timezone: true,
      nightlyTarget: true,
      bedtimeTarget: true,
      streakGoal: true,
    },
  });

  return NextResponse.json(updatedUser);
}
