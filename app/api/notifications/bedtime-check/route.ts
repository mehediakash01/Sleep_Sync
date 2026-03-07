import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notifyBedtimeReminder } from "@/lib/notifications";

// POST /api/notifications/bedtime-check
// Called client-side when the user is near their set bedtime
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await notifyBedtimeReminder(user.id, user.email, user.name);

  return NextResponse.json({ success: true });
}
