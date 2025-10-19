import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

const soothingTracks = [
  "https://cdn.pixabay.com/audio/2022/03/15/audio_47a8eab98e.mp3",
  "https://cdn.pixabay.com/audio/2023/02/12/audio_fdcfd63e59.mp3",
  "https://cdn.pixabay.com/audio/2023/03/03/audio_1d6c7e40e4.mp3",
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = `
      You are SleepSync's sleep coach assistant.
      The user says: "${message}"
      Respond in 2–3 calm sentences with actionable, kind advice for insomnia.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

   const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate tips right now.";
    const music = soothingTracks[Math.floor(Math.random() * soothingTracks.length)];

    return NextResponse.json({ reply, music });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ message: "Chat generation failed" }, { status: 500 });
  }
}
