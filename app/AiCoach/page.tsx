"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Bot,
  Clock3,
  Menu,
  MessageSquare,
  Mic,
  MoonStar,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";

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

const suggestedPrompts = [
  "I noticed my REM was low last night. What should I try tonight?",
  "Give me a realistic wind-down routine for work travel.",
  "Why does my sleep score improve when I sleep earlier?",
  "Suggest a short breathing ritual before bed.",
];

export default function AiChatSection() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sleep-conversations");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      if (parsed.length > 0) {
        setCurrentConvoId((prev) => prev ?? parsed[0].id);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sleep-conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, currentConvoId]);

  const currentConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === currentConvoId),
    [conversations, currentConvoId]
  );

  const createConversation = () => {
    const newConversation: Conversation = {
      id: `convo_${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConvoId(newConversation.id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const deleteConversation = (id: string) => {
    const remaining = conversations.filter((conversation) => conversation.id !== id);
    setConversations(remaining);

    if (currentConvoId === id) {
      setCurrentConvoId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateConversationTitle = (messages: Message[]) => {
    const firstUserMessage = messages.find((message) => message.role === "user");
    if (!firstUserMessage) return "New Conversation";

    return firstUserMessage.content.length > 50
      ? `${firstUserMessage.content.slice(0, 50)}...`
      : firstUserMessage.content;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    let convoId = currentConvoId;
    if (!convoId) {
      const newConversation: Conversation = {
        id: `convo_${Date.now()}`,
        title: "New Conversation",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConvoId(newConversation.id);
      convoId = newConversation.id;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    const existingMessages =
      conversations.find((conversation) => conversation.id === convoId)?.messages || [];
    const nextMessages = [...existingMessages, userMessage];

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === convoId
          ? {
              ...conversation,
              messages: nextMessages,
              title:
                conversation.messages.length === 0
                  ? updateConversationTitle(nextMessages)
                  : conversation.title,
              updatedAt: Date.now(),
            }
          : conversation
      )
    );

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/aiChat", {
        messages: nextMessages,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: res.data.reply ?? "Sorry, I couldn't respond properly.",
        timestamp: Date.now(),
        sources: Array.isArray(res.data.sources) ? res.data.sources : undefined,
      };

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === convoId
            ? {
                ...conversation,
                messages: [...conversation.messages, assistantMessage],
                updatedAt: Date.now(),
              }
            : conversation
        )
      );
    } catch (error) {
      console.error(error);

      const assistantMessage: Message = {
        role: "assistant",
        content: "Something went wrong. Try again in a moment.",
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === convoId
            ? {
                ...conversation,
                messages: [...conversation.messages, assistantMessage],
                updatedAt: Date.now(),
              }
            : conversation
        )
      );
    } finally {
      setLoading(false);
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

  return (
    <main className="premium-page min-h-screen px-4 pb-8 pt-24 text-[var(--app-text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-7xl gap-4">
        <aside
          className={`premium-panel-strong fixed inset-y-24 left-4 z-40 flex w-[86vw] max-w-sm flex-col rounded-[32px] p-4 transition-transform duration-300 md:static md:translate-x-0 md:w-80 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[120%]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)]">
                <MoonStar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-[#9BC5FF]">SLEEP COACH</p>
                <p className="text-sm text-[var(--app-text-muted)]">Conversation history</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 md:hidden"
              aria-label="Close conversation sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={createConversation}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-5 py-3.5 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_14px_44px_rgba(0,229,194,0.22)]"
          >
            <Plus className="h-4 w-4" />
            New session
          </button>

          <div className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
            {conversations.length === 0 ? (
              <div className="premium-panel flex h-full min-h-[240px] flex-col items-center justify-center rounded-[28px] p-6 text-center">
                <MessageSquare className="h-8 w-8 text-[var(--app-text-muted)]" />
                <p className="mt-4 text-sm text-[var(--app-text-muted)]">No sessions yet. Start a conversation to save your coaching history.</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    setCurrentConvoId(conversation.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full rounded-[24px] border p-4 text-left transition-all duration-300 ${
                    currentConvoId === conversation.id
                      ? "border-[var(--app-accent-strong)]/25 bg-[var(--app-accent-strong)]/10"
                      : "border-[var(--app-line)] bg-white/5 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{conversation.title}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--app-text-muted)]">
                        <Clock3 className="h-3 w-3" />
                        <span>{formatTime(conversation.updatedAt)}</span>
                        <span>•</span>
                        <span>{conversation.messages.length} msgs</span>
                      </div>
                    </div>
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--app-text-muted)] transition-colors duration-300 hover:bg-[#F97F9A]/10 hover:text-[#F97F9A]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-[#020617]/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close conversation sidebar backdrop"
          />
        )}

        <section className="premium-panel-strong relative flex flex-1 flex-col overflow-hidden rounded-[36px]">
          <header className="flex items-center justify-between border-b border-[var(--app-line)] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 md:hidden"
                aria-label="Open conversation sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Sleep Coach</p>
                <p className="text-xs text-[var(--app-text-muted)]">Empathetic sleep guidance, session by session</p>
              </div>
            </div>

            {currentConversation && (
              <div className="hidden rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-1.5 text-xs text-[var(--app-text-muted)] sm:block">
                {currentConversation.messages.length} messages
              </div>
            )}
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
              {!currentConversation || currentConversation.messages.length === 0 ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)] shadow-[0_0_30px_rgba(0,229,194,0.18)]">
                    <MoonStar className="h-9 w-9" />
                  </div>
                  <h1 className="mt-8 text-3xl font-semibold tracking-[-0.03em]">Your sleep coach is ready.</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--app-text-muted)]">
                    Ask about last night, request a wind-down routine, or get help interpreting a pattern. The tone stays calm, precise, and useful.
                  </p>

                  <div className="mt-8 grid w-full max-w-3xl gap-3 sm:grid-cols-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setInput(prompt)}
                        className="premium-panel rounded-[24px] p-4 text-left text-sm leading-7 text-[var(--app-text-muted)] transition-colors duration-300 hover:border-[var(--app-accent-strong)]/20 hover:text-[var(--app-text)]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                currentConversation.messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex items-end gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)]">
                        <MoonStar className="h-4 w-4" />
                      </div>
                    )}

                    <div className={`max-w-[82%] ${message.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                      <div
                        className={`rounded-[26px] px-5 py-4 text-sm leading-8 shadow-sm ${
                          message.role === "user"
                            ? "bg-[var(--app-accent-strong)] text-[#062019]"
                            : "border border-[var(--app-line)] bg-white/5 text-[var(--app-text)]"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                        <div className="rounded-[22px] border border-[var(--app-line)] bg-white/5 px-4 py-3 text-xs leading-6 text-[var(--app-text-muted)]">
                          <p className="font-semibold text-[var(--app-text)]">Sources</p>
                          <ul className="mt-2 space-y-1">
                            {message.sources.map((source, sourceIndex) => (
                              <li key={`${source.url}-${sourceIndex}`}>
                                <a href={source.url} target="_blank" rel="noreferrer" className="underline hover:text-[var(--app-accent-strong)]">
                                  {source.label}
                                </a>{" "}
                                ({new Date(source.crawledAt).getFullYear()})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {message.timestamp && (
                        <p className="px-1 text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 text-sm font-semibold text-[var(--app-text-muted)]">
                        U
                      </div>
                    )}
                  </div>
                ))
              )}

              {loading && (
                <div className="flex items-end gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)]">
                    <MoonStar className="h-4 w-4" />
                  </div>
                  <div className="rounded-[24px] border border-[var(--app-line)] bg-white/5 px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--app-accent-strong)]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--app-accent-strong)] [animation-delay:150ms]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--app-accent-strong)] [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-[var(--app-line)] px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-2 rounded-[26px] border border-[var(--app-line)] bg-white/5 px-4 py-3 backdrop-blur-2xl">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[var(--app-text-muted)] transition-colors duration-300 hover:text-[var(--app-text)]"
                  aria-label="Voice note coming soon"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      sendMessage();
                    }
                  }}
                  placeholder="Ask about your sleep..."
                  className="flex-1 bg-transparent text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-sm font-semibold text-[#062019] transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">{loading ? "Thinking..." : "Send"}</span>
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-[var(--app-text-muted)]">
                Press Enter to send. Voice notes can layer on top later without changing the current flow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
