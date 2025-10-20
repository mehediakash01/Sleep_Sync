"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/aiChat", {
        messages: [...messages, newMessage],
      });

      const aiMessage: Message = {
        role: "assistant",
        content: res.data.reply ?? "Sorry, I couldn’t respond properly.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Send on Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl pt-32 px-6 pb-6 flex flex-col h-[80vh]">
      <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-4">
        💤 AI Sleep Assistant
      </h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto border rounded-xl p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">
            Ask your AI anything about improving your sleep habits 😴
          </p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="mt-4 flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Thinking" : "Send"}
        </button>
      </div>
    </div>
  );
}
