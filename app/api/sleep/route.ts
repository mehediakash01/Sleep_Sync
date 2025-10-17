import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const newLog = await prisma.sleepLog.create({
    data: {
      ...data,
      userId: user!.id,
      dateOfSession: new Date(data.dateOfSession),
      timeInBed: new Date(data.timeInBed),
      wakeUpTime: new Date(data.wakeUpTime),
    },
  });

  return NextResponse.json(newLog);
}
