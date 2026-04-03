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

const MAX_HISTORY_MESSAGES = 6;
const MAX_SLEEP_LOGS = 3;
const MAX_OUTPUT_TOKENS = 320;
const RAG_TRIGGER_KEYWORDS = [
  "insomnia",
  "sleep apnea",
  "sleep cycle",
  "sleep quality",
  "deep sleep",
  "rem",
  "circadian",
  "melatonin",
  "caffeine",
  "alcohol",
  "jet lag",
  "stress",
  "anxiety",
  "research",
  "study",
  "evidence",
  "supplement",
  "blue light",
  "wind down",
  "bedtime",
];

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
    .slice(0, MAX_SLEEP_LOGS)
    .map((log) => {
      const durationHours =
        (log.wakeUpTime.getTime() - log.timeInBed.getTime()) / (1000 * 60 * 60);

      return `${log.dateOfSession.toDateString()}: ${durationHours.toFixed(
        1
      )}h asleep, quality ${log.sleepQuality}/5, mood ${log.mood ?? "N/A"}`;
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
    take: MAX_SLEEP_LOGS,
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

function shouldUseRag(question: string): boolean {
  const normalizedQuestion = question.toLowerCase();

  return RAG_TRIGGER_KEYWORDS.some((keyword) =>
    normalizedQuestion.includes(keyword)
  );
}

function isCapacityError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    message.includes("429") ||
    message.includes("over capacity") ||
    message.includes("resource has been exhausted") ||
    message.includes("quota")
  );
}

function buildBasePrompt(sleepLogSummary: string): string {
  return `
You are SleepSync's friendly AI sleep coach.
Respond like a calm, knowledgeable sleep therapist.
Use the recent sleep data below when it is relevant:
${sleepLogSummary}

Keep advice practical, warm, and concise.
Offer 2 or 3 concrete next steps when helpful.
If the user mentions stress, insomnia, or anxiety, suggest a short wind-down or breathing exercise.
End with a soft, human sign-off such as "Sleep well tonight."
  `.trim();
}

function buildRagPrompt(
  retrievedKnowledge: string,
  sleepLogSummary: string,
  userQuestion: string
): string {
  return `
You are SleepSync's expert AI sleep coach.
Use the retrieved expert knowledge only when it clearly helps answer the user's question.

Retrieved knowledge:
${retrievedKnowledge}

User sleep data:
${sleepLogSummary}

User question:
${userQuestion || "No explicit user question provided."}

Give practical, evidence-based advice in a calm tone.
Keep the answer concise and actionable.
Only cite a source when you truly used it, like (Mayo Clinic).
End with a soft, reassuring sign-off.
  `.trim();
}

async function generateCoachReply(
  systemPrompt: string,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
    contents,
  });

  return (
    response?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I hit a temporary issue while thinking. Please try again in a moment."
  );
}

export async function POST(req: Request) {
  try {
    const { messages }: ChatRequestBody = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ message: "messages are required" }, { status: 400 });
    }

    // Per-user rate limiting to protect API quota.
    const session = await getServerSession(authOptions);
    const rateLimitKey = session?.user?.email ?? req.headers.get("x-forwarded-for") ?? "anon";
    const rateCheck = checkRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          reply: `You're sending messages too fast. Please wait ${rateCheck.waitSeconds} second${rateCheck.waitSeconds !== 1 ? "s" : ""} before trying again.`,
        },
        { status: 429 }
      );
    }

    const userQuestion = getLastUserQuestion(messages);
    const ragEnabled = process.env.USE_RAG?.toLowerCase() === "true";
    const useRag = ragEnabled && Boolean(userQuestion) && shouldUseRag(userQuestion);

    const [ragResult, sleepLogSummary] = await Promise.all([
      useRag
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

    const formatted = messages.map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    }));

    const trimmedMessages = formatted.slice(-MAX_HISTORY_MESSAGES);
    const basePrompt = buildBasePrompt(sleepLogSummary);
    const ragPrompt = buildRagPrompt(
      ragResult.context,
      sleepLogSummary,
      userQuestion
    );

    let reply = "";
    let usedRag = useRag && Boolean(ragResult.context);

    try {
      reply = await generateCoachReply(
        usedRag ? ragPrompt : basePrompt,
        trimmedMessages
      );
    } catch (error) {
      if (usedRag && isCapacityError(error)) {
        console.warn("[aiChat] Falling back to non-RAG response after capacity error.");
        reply = await generateCoachReply(basePrompt, trimmedMessages);
        usedRag = false;
      } else {
        throw error;
      }
    }

    const responseBody: ChatResponseBody = { reply };
    if (usedRag && ragResult.sources.length > 0) {
      responseBody.sources = ragResult.sources;
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("AI Chat Error:", error);

    if (isCapacityError(error)) {
      const waitSec = parseRetryDelay(error);
      const waitMsg = waitSec
        ? `Please wait ${waitSec} second${waitSec !== 1 ? "s" : ""} and try again.`
        : "Please wait a moment and try again.";

      return NextResponse.json({
        reply: `The AI service is temporarily over capacity. ${waitMsg}`,
      });
    }

    return NextResponse.json({
      reply: "I hit a temporary issue while thinking. Try asking again in a moment.",
    });
  }
}
