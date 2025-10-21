import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const logs = await prisma.sleepLog.findMany({
      where: {
        user: { email },
      },
      orderBy: { dateOfSession: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching sleep logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
