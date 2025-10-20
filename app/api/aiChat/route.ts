import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    // Convert your frontend message format to Gemini's expected format
    const formatted = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const systemPrompt = `
      You are SleepSync's friendly AI sleep coach.
      Respond like a calm, knowledgeable sleep therapist.
      Use short, practical suggestions backed by science.
      If user mentions stress, insomnia, or anxiety — recommend breathing or relaxation exercises.
      Keep tone warm and conversational, never robotic.
      End your message with a soft sleep-related emoji like 🌙 or 😴.
    `;

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
    return NextResponse.json(
      { message: "AI chat failed" },
      { status: 500 }
    );
  }
}
