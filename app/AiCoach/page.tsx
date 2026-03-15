"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Plus, Send, Moon, Trash2, Clock, Menu, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  sources?: Array<{
    label: string;
    url: string;
    crawledAt: string;
  }>;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export default function AiChatSection() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sleep-conversations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0 && !currentConvoId) {
          setCurrentConvoId(parsed[0].id);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConvoId, conversations]);

  const getCurrentConversation = () => {
    return conversations.find((c) => c.id === currentConvoId);
  };

  const createNewConversation = () => {
    const newConvo: Conversation = {
      id: `convo_${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConvo, ...prev]);
    setCurrentConvoId(newConvo.id);
    // Close sidebar on mobile after creating conversation
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConvoId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setCurrentConvoId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateConversationTitle = (messages: Message[]) => {
    const firstUserMessage = messages.find((m) => m.role === "user");
    if (firstUserMessage) {
      return (
        firstUserMessage.content.slice(0, 50) +
        (firstUserMessage.content.length > 50 ? "..." : "")
      );
    }
    return "New Conversation";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    let convoId = currentConvoId;

    // Create new conversation if none exists
    if (!convoId) {
      const newConvo: Conversation = {
        id: `convo_${Date.now()}`,
        title: "New Conversation",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations((prev) => [newConvo, ...prev]);
      convoId = newConvo.id;
      setCurrentConvoId(convoId);
    }

    const newMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    // Update conversation with new user message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              title:
                c.messages.length === 0
                  ? updateConversationTitle([newMessage])
                  : c.title,
              updatedAt: Date.now(),
            }
          : c
      )
    );

    setInput("");
    setLoading(true);

    try {
      // Get current conversation messages
      const updatedMessages = [
        ...(getCurrentConversation()?.messages || []),
        newMessage,
      ];

      // Send to API
      const res = await axios.post("/api/aiChat", {
        messages: updatedMessages,
      });

      const aiMessage: Message = {
        role: "assistant",
        content: res.data.reply ?? "Sorry, I couldn't respond properly.",
        timestamp: Date.now(),
        sources: Array.isArray(res.data.sources) ? res.data.sources : undefined,
      };

      // Update conversation with AI response
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? {
                ...c,
                messages: [...c.messages, aiMessage],
                updatedAt: Date.now(),
              }
            : c
        )
      );
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: "assistant",
        content: "⚠️ Something went wrong. Try again later.",
        timestamp: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? {
                ...c,
                messages: [...c.messages, errorMessage],
                updatedAt: Date.now(),
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const currentConvo = getCurrentConversation();

  const SUGGESTED = [
    "How can I fall asleep faster?",
    "What's the ideal sleep schedule?",
    "Tips to stop waking up at night",
    "How does screen time affect sleep?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f7ff] via-white to-[#f3eeff] pt-20 pb-4 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex flex-col md:flex-row gap-3">

        {/* ── SIDEBAR ── */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${
            sidebarOpen ? "w-full md:w-72" : "w-0 md:w-0"
          } fixed md:relative inset-0 md:inset-auto z-40 md:z-0 transition-all duration-300 bg-white md:rounded-2xl border border-gray-100 flex flex-col overflow-hidden shadow-xl md:shadow-md`}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-100">
            {/* Brand row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] flex items-center justify-center">
                  <Moon className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800 text-sm">Sleep AI</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <button
              onClick={createNewConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white rounded-xl hover:opacity-90 transition font-medium text-sm shadow-md shadow-[#89CFF0]/30"
            >
              <Plus className="w-4 h-4" />
              New conversation
            </button>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No conversations yet</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <div
                  key={convo.id}
                  onClick={() => {
                    setCurrentConvoId(convo.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    currentConvoId === convo.id
                      ? "bg-gradient-to-r from-[#89CFF0]/15 to-[#B19CD9]/15 border border-[#89CFF0]/40"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${currentConvoId === convo.id ? "text-[#4a9fc0]" : "text-gray-700"}`}>
                        {convo.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(convo.updatedAt)}</span>
                        <span>·</span>
                        <span>{convo.messages.length} msgs</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── MAIN CHAT ── */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <Menu className="w-4 h-4 text-gray-500" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] flex items-center justify-center shadow-sm shadow-[#89CFF0]/30">
                  <Moon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-800 leading-none">AI Sleep Coach</h1>
                  <p className="text-[11px] text-gray-400 mt-0.5">Powered by Gemini AI</p>
                </div>
              </div>
            </div>
            {currentConvo && (
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full hidden sm:block">
                {currentConvo.messages.length} messages
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5">
            <div className="max-w-3xl mx-auto space-y-4">
              {!currentConvo || currentConvo.messages.length === 0 ? (
                <div className="flex flex-col items-center text-center py-10 gap-6">
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] flex items-center justify-center shadow-lg shadow-[#89CFF0]/30">
                    <Moon className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                      Your Sleep Coach is Ready
                    </h2>
                    <p className="text-gray-400 text-sm max-w-sm">
                      Ask me anything about sleep hygiene, schedules, or habits. I&apos;m here to help you rest better.
                    </p>
                  </div>
                  {/* Suggested prompts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setInput(s); }}
                        className="text-left text-xs px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#89CFF0]/50 hover:bg-[#89CFF0]/5 text-gray-600 transition-all duration-150"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                currentConvo.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* AI avatar */}
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] flex items-center justify-center shrink-0 mb-1 shadow-sm">
                        <Moon className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}

                    <div className={`flex flex-col gap-1 max-w-[80%] sm:max-w-[70%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white rounded-br-sm"
                            : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                        <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                          <p className="font-semibold text-slate-700">Sources:</p>
                          <ul className="mt-1 space-y-1">
                            {msg.sources.map((source, idx) => (
                              <li key={`${source.url}-${idx}`} className="leading-relaxed">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-700 underline hover:text-sky-800"
                                >
                                  {source.label}
                                </a>{" "}
                                <span className="text-slate-500">
                                  ({new Date(source.crawledAt).getFullYear()})
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {msg.timestamp && (
                        <p className="text-[10px] text-gray-400 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>

                    {/* User avatar */}
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mb-1 text-xs font-bold text-gray-500">
                        U
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-end gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] flex items-center justify-center shrink-0 mb-1">
                    <Moon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#89CFF0] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#B19CD9] rounded-full animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 bg-[#89CFF0] rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="px-3 sm:px-6 py-4 border-t border-gray-100 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 focus-within:border-[#89CFF0]/60 rounded-2xl px-4 py-2.5 transition-all duration-200 shadow-sm">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about your sleep..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition shadow-md shadow-[#89CFF0]/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{loading ? "Thinking..." : "Send"}</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-400 text-center mt-2">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Enter</kbd> to send
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}