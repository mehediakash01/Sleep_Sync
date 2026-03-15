import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { retrieveRelevantKnowledge } from "@/lib/retrieveRelevantKnowledge";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

function getLastUserQuestion(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") {
      return messages[i].content?.trim() ?? "";
    }
  }

  return "";
}

function summarizeSleepLogs(
  logs: Array<{
    dateOfSession: Date;
    timeInBed: Date;
    wakeUpTime: Date;
    sleepQuality: number;
    mood: string | null;
  }>
): string {
  if (logs.length === 0) {
    return "No recent sleep logs available.";
  }

  return logs
    .map((log) => {
      const durationHours =
        (log.wakeUpTime.getTime() - log.timeInBed.getTime()) / (1000 * 60 * 60);

      return `Date: ${log.dateOfSession.toDateString()}, Duration: ${durationHours.toFixed(
        1
      )}h, Quality: ${log.sleepQuality}/5, Mood: ${log.mood ?? "N/A"}`;
    })
    .join("\n");
}

async function getSleepLogSummaryFromSession(): Promise<string> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return "No recent sleep logs available.";
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return "No recent sleep logs available.";
  }

  const logs = await prisma.sleepLog.findMany({
    where: { userId: user.id },
    orderBy: { dateOfSession: "desc" },
    take: 7,
    select: {
      dateOfSession: true,
      timeInBed: true,
      wakeUpTime: true,
      sleepQuality: true,
      mood: true,
    },
  });

  return summarizeSleepLogs(logs);
}

export async function POST(req: Request) {
  try {
    const { messages }: ChatRequestBody = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ message: "messages are required" }, { status: 400 });
    }

    const userQuestion = getLastUserQuestion(messages);
    const useRag = process.env.USE_RAG?.toLowerCase() === "true";

    const [retrievedKnowledge, sleepLogSummary] = await Promise.all([
      useRag && userQuestion
        ? retrieveRelevantKnowledge(userQuestion).catch((error) => {
            console.error("[aiChat] RAG retrieval failed:", error);
            return "";
          })
        : Promise.resolve(""),
      getSleepLogSummaryFromSession().catch((error) => {
        console.error("[aiChat] sleep log context failed:", error);
        return "No recent sleep logs available.";
      }),
    ]);

    // Convert your frontend message format to Gemini's expected format
    const formatted = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const basePrompt = `
You are SleepSync's friendly AI sleep coach.
Respond like a calm, knowledgeable sleep therapist.
Use short, practical suggestions backed by science.
If user mentions stress, insomnia, or anxiety, recommend breathing or relaxation exercises.
Keep tone warm and conversational, never robotic.
End your message with a soft sleep-related emoji like 🌙 or 😴.
    `.trim();

    const ragPrompt = `
You are an expert sleep coach. Use ONLY the following retrieved expert knowledge and user's sleep logs to answer accurately and cite sources.

Retrieved knowledge:
${retrievedKnowledge}

User sleep data:
${sleepLogSummary}

User question:
${userQuestion || "No explicit user question provided."}

Give practical, evidence-based advice. Keep response concise and encouraging.
    `.trim();

    const systemPrompt = useRag && retrievedKnowledge ? ragPrompt : basePrompt;

    // Generate the AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...formatted,
      ],
    });

    const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn’t think clearly 😴";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({
      reply:
        "I hit a temporary issue while thinking. Try asking again in a moment and I will help you with a practical sleep plan 🌙",
    });
  }
}
