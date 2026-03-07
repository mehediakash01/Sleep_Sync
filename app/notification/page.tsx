"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  Moon,
  Flame,
  AlertTriangle,
  BedDouble,
  Loader2,
  Settings,
  Mail,
  BellOff,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: "SLEEP_LOGGED" | "STREAK" | "POOR_SLEEP" | "BEDTIME_REMINDER";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotifSettings {
  emailEnabled: boolean;
  bedtimeReminder: boolean;
  bedtimeHour: number;
  bedtimeMinute: number;
  poorSleepAlert: boolean;
  streakAlert: boolean;
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const typeConfig: Record<
  Notification["type"],
  { icon: React.ReactNode; color: string; bg: string }
> = {
  SLEEP_LOGGED: { icon: <Moon size={18} />, color: "text-blue-600", bg: "bg-blue-100" },
  STREAK:       { icon: <Flame size={18} />, color: "text-orange-500", bg: "bg-orange-100" },
  POOR_SLEEP:   { icon: <AlertTriangle size={18} />, color: "text-red-500", bg: "bg-red-100" },
  BEDTIME_REMINDER: { icon: <BedDouble size={18} />, color: "text-purple-600", bg: "bg-purple-100" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotifSettings>({
    emailEnabled: true,
    bedtimeReminder: false,
    bedtimeHour: 22,
    bedtimeMinute: 30,
    poorSleepAlert: true,
    streakAlert: true,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error();
      setNotifications(await res.json());
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/notification-settings");
      if (!res.ok) throw new Error();
      setSettings(await res.json());
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);
  useEffect(() => { if (showSettings) fetchSettings(); }, [showSettings, fetchSettings]);

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await fetch("/api/notifications/read-all", { method: "PATCH" });
    toast.success("All notifications marked as read");
  };

  const deleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    toast.success("Notification deleted");
  };

  const clearRead = async () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
    await fetch("/api/notifications", { method: "DELETE" });
    toast.success("Cleared all read notifications");
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/notification-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const displayed = tab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount   = notifications.filter((n) =>  n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] flex items-center justify-center shadow">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              {unreadCount > 0 && <p className="text-xs text-gray-500">{unreadCount} unread</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-[#4a9fc0] hover:text-[#89CFF0] font-medium transition-colors">
                <CheckCheck size={16} /> Mark all read
              </button>
            )}
            <button
              onClick={() => setShowSettings((s) => !s)}
              className={`p-2 rounded-xl transition-colors ${showSettings ? "bg-[#89CFF0]/20 text-[#4a9fc0]" : "hover:bg-gray-100 text-gray-500"}`}
            >
              <Settings size={18} />
            </button>
          </div>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Settings size={16} className="text-[#89CFF0]" /> Notification Preferences
                </h2>
                {settingsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 size={22} className="animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { key: "emailEnabled"    as keyof NotifSettings, label: "Email notifications", desc: "Receive notifications via Gmail",            icon: <Mail size={16} className="text-blue-500" /> },
                      { key: "poorSleepAlert"  as keyof NotifSettings, label: "Poor sleep alerts",   desc: "Alert when sleep quality < 3/5",            icon: <AlertTriangle size={16} className="text-red-400" /> },
                      { key: "streakAlert"     as keyof NotifSettings, label: "Streak milestones",   desc: "Celebrate streaks (3, 7, 14 days)",        icon: <Flame size={16} className="text-orange-400" /> },
                      { key: "bedtimeReminder" as keyof NotifSettings, label: "Bedtime reminder",    desc: "Remind me when bedtime approaches",          icon: <BedDouble size={16} className="text-purple-500" /> },
                    ].map(({ key, label, desc, icon }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{icon}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{label}</p>
                            <p className="text-xs text-gray-400">{desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSettings((s) => ({ ...s, [key]: !s[key] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${settings[key] ? "bg-[#89CFF0]" : "bg-gray-200"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${settings[key] ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>
                    ))}

                    {settings.bedtimeReminder && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 pl-7">
                        <Clock size={15} className="text-gray-400" />
                        <label className="text-sm text-gray-600">Bedtime:</label>
                        <input type="number" min={0} max={23} value={settings.bedtimeHour}
                          onChange={(e) => setSettings((s) => ({ ...s, bedtimeHour: parseInt(e.target.value) }))}
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#89CFF0]/50"
                        />
                        <span className="text-gray-400">:</span>
                        <input type="number" min={0} max={59} value={settings.bedtimeMinute}
                          onChange={(e) => setSettings((s) => ({ ...s, bedtimeMinute: parseInt(e.target.value) }))}
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#89CFF0]/50"
                        />
                        <span className="text-xs text-gray-400">(24h)</span>
                      </motion.div>
                    )}

                    <button onClick={saveSettings} disabled={savingSettings}
                      className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {savingSettings && <Loader2 size={16} className="animate-spin" />}
                      Save preferences
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
            {(["all", "unread"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? "bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                {t}
                {t === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
          {readCount > 0 && (
            <button onClick={clearRead} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors">
              <Trash2 size={13} /> Clear read
            </button>
          )}
        </div>

        {/* Notification List */}
        <motion.div layout className="space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={28} className="animate-spin text-[#89CFF0]" />
              <p className="text-sm text-gray-400">Loading notifications</p>
            </div>
          ) : displayed.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <BellOff size={28} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-500">{tab === "unread" ? "All caught up!" : "No notifications yet"}</p>
                <p className="text-sm text-gray-400 mt-1">{tab === "unread" ? "You have no unread notifications." : "Log your sleep to start receiving updates."}</p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {displayed.map((notif) => {
                const config = typeConfig[notif.type];
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => !notif.isRead && markRead(notif.id)}
                    className={`group relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      notif.isRead
                        ? "bg-white border-gray-100 opacity-60 hover:opacity-100"
                        : "bg-white border-[#89CFF0]/30 shadow-sm hover:shadow-md hover:border-[#89CFF0]/60"
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-4 right-12 w-2 h-2 rounded-full bg-[#89CFF0]" />
                    )}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${notif.isRead ? "text-gray-500" : "text-gray-800"}`}>{notif.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                      <p className="text-[11px] text-gray-300 mt-1">{relativeTime(notif.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => deleteOne(notif.id, e)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}
