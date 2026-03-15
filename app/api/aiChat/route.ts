import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  retrieveRelevantKnowledgeWithSources,
  type RagSource,
} from "@/lib/retrieveRelevantKnowledge";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

interface ChatResponseBody {
  reply: string;
  sources?: RagSource[];
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

// Simple in-process rate limiter: max 4 requests per user per minute
const userRateMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 4;

function checkRateLimit(userId: string): { allowed: boolean; waitSeconds: number } {
  const now = Date.now();
  const entry = userRateMap.get(userId);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    userRateMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true, waitSeconds: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - entry.windowStart)) / 1000);
    return { allowed: false, waitSeconds };
  }

  entry.count += 1;
  return { allowed: true, waitSeconds: 0 };
}

function parseRetryDelay(error: unknown): number | null {
  try {
    const msg = error instanceof Error ? error.message : String(error);
    const match = msg.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
    if (match) return Math.ceil(parseFloat(match[1]));
    const secMatch = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
    if (secMatch) return Math.ceil(parseFloat(secMatch[1]));
  } catch {
    // ignore
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages }: ChatRequestBody = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ message: "messages are required" }, { status: 400 });
    }

    // Per-user rate limiting to protect API quota
    const session = await getServerSession(authOptions);
    const rateLimitKey = session?.user?.email ?? req.headers.get("x-forwarded-for") ?? "anon";
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          reply: `You're sending messages too fast — please wait ${rateCheck.waitSeconds} second${rateCheck.waitSeconds !== 1 ? "s" : ""} before trying again 🌙`,
        },
        { status: 429 }
      );
    }

    const userQuestion = getLastUserQuestion(messages);
    const useRag = process.env.USE_RAG?.toLowerCase() === "true";

    const [ragResult, sleepLogSummary] = await Promise.all([
      useRag && userQuestion
        ? retrieveRelevantKnowledgeWithSources(userQuestion).catch((error) => {
            console.error("[aiChat] RAG retrieval failed:", error);
            return { context: "", sources: [] };
          })
        : Promise.resolve({ context: "", sources: [] }),
      getSleepLogSummaryFromSession().catch((error) => {
        console.error("[aiChat] sleep log context failed:", error);
        return "No recent sleep logs available.";
      }),
    ]);

    const retrievedKnowledge = ragResult.context;
    const ragSources = ragResult.sources;

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
Cite sources like (Mayo Clinic, 2026) for any used knowledge.
    `.trim();

    const systemPrompt = useRag && retrievedKnowledge ? ragPrompt : basePrompt;

    // Keep only the last 10 messages to limit token usage
    const trimmedMessages = formatted.slice(-10);

    // Generate the AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      config: { systemInstruction: systemPrompt },
      contents: trimmedMessages,
    });

    const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't think clearly 😴";

    const responseBody: ChatResponseBody = { reply };
    if (useRag && ragSources.length > 0) {
      responseBody.sources = ragSources;
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("AI Chat Error:", error);

    const is429 = error instanceof Error && error.message.includes("429");
    if (is429) {
      const waitSec = parseRetryDelay(error);
      const waitMsg = waitSec
        ? `Please wait ${waitSec} second${waitSec !== 1 ? "s" : ""} and try again.`
        : "Please wait a moment and try again.";
      return NextResponse.json({
        reply: `The AI service is temporarily over capacity. ${waitMsg} 🌙`,
      });
    }

    return NextResponse.json({
      reply: "I hit a temporary issue while thinking. Try asking again in a moment 🌙",
    });
  }
}

