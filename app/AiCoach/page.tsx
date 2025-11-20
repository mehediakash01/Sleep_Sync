"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Plus, Send, Moon, Trash2, Clock } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
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
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(
        "sleep-conversations",
        JSON.stringify(conversations)
      );
    }
  }, [conversations]);

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

  return (
    <div className="flex h-screen bg-gradient-to-br py-22 from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Conversation</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((convo) => (
              <div
                key={convo.id}
                onClick={() => setCurrentConvoId(convo.id)}
                className={`group relative p-3 rounded-xl cursor-pointer transition ${
                  currentConvoId === convo.id
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {convo.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(convo.updatedAt)}</span>
                      <span className="mx-1">•</span>
                      <span>{convo.messages.length} msgs</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(convo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Moon className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Sleep Assistant
              </h1>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {currentConvo && `${currentConvo.messages.length} messages`}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {!currentConvo || currentConvo.messages.length === 0 ? (
              <div className="text-center py-12">
                <Moon className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to Your Sleep Assistant
                </h2>
                <p className="text-gray-500">
                  Ask me anything about improving your sleep habits 😴
                </p>
              </div>
            ) : (
              currentConvo.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-[75%] shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    {msg.timestamp && (
                      <p
                        className={`text-xs mt-2 ${
                          msg.role === "user"
                            ? "text-indigo-100"
                            : "text-gray-400"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-3 border-2 border-gray-200 focus-within:border-indigo-400 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 px-2"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-200 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="font-medium">
                  {loading ? "Sending..." : "Send"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
