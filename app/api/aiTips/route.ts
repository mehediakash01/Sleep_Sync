import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import prisma from "@/prisma/prismaClient";

export async function POST(req: Request) {
  try {
   const { email } = await req.json();

const user = await prisma.user.findUnique({
  where: { email },
  select: { id: true },
});

if (!user) {
  return NextResponse.json({ message: "User not found." }, { status: 404 });
}

const logs = await prisma.sleepLog.findMany({
  where: { userId: user.id },
  orderBy: { dateOfSession: "desc" },
  take: 7,
});


    if (!logs.length) {
      return NextResponse.json({ message: "No sleep logs found." }, { status: 404 });
    }

    const summary = logs
      .map(
        (log) =>
          `Date: ${log.dateOfSession.toDateString()}, Duration: ${
            (log.wakeUpTime.getTime() - log.timeInBed.getTime()) / (1000 * 60 * 60)
          } hrs, Bedtime: ${log.timeInBed.toLocaleTimeString()}, Wake Time: ${log.wakeUpTime.toLocaleTimeString()}, Mood: ${log.mood ?? "N/A"}`
      )
      .join("\n");

 
    const prompt = `
      You are SleepSync's AI assistant — gentle and caring.
      Based on this user's sleep log:
      ${summary}
      Generate 3 short, calm, and science-backed tips to improve their sleep routine.
      Keep your tone soothing and encouraging.
    `;

    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const tips =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate tips right now.";

    return NextResponse.json({ tips });
  } catch (error) {
    console.error("AI Tips Error:", error);
    return NextResponse.json({ message: "AI generation failed" }, { status: 500 });
  }
}
