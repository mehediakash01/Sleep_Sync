import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PATCH /api/notifications/read-all — mark ALL notifications as read
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
