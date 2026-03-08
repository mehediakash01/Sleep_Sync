import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/lib/authOptions";

// PATCH /api/notifications/[id] — mark a single notification as read
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return NextResponse.json(updated);
}

// DELETE /api/notifications/[id] — delete a single notification
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.notification.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
