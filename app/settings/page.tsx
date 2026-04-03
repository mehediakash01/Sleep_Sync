"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Check,
  Database,
  Download,
  Goal,
  Link2,
  ShieldCheck,
  Trash2,
  Unlink2,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";

const tabs = [
  { id: "account", label: "Account", icon: UserRound },
  { id: "devices", label: "Connected Devices", icon: Database },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "goals", label: "Sleep Goals", icon: Goal },
  { id: "privacy", label: "Data & Privacy", icon: ShieldCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];

type AccountState = {
  name: string;
  email: string;
  timezone: string;
};

type DeviceState = Record<"appleHealth" | "oura" | "garmin", boolean>;

type NotificationState = Record<"bedtime" | "summary" | "streaks", boolean>;

type GoalState = {
  nightlyTarget: number;
  bedtimeTarget: string;
  streakGoal: number;
};

const SETTINGS_KEY = "sleep-sync-settings";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabId>("account");
  const [mounted, setMounted] = useState(false);
  const [account, setAccount] = useState<AccountState>({
    name: "",
    email: "",
    timezone: "Asia/Dhaka",
  });
  const [devices, setDevices] = useState<DeviceState>({
    appleHealth: false,
    oura: false,
    garmin: false,
  });
  const [notifications, setNotifications] = useState<NotificationState>({
    bedtime: true,
    summary: true,
    streaks: true,
  });
  const [goals, setGoals] = useState<GoalState>({
    nightlyTarget: 7.5,
    bedtimeTarget: "22:45",
    streakGoal: 14,
  });

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<{
          account: AccountState;
          devices: DeviceState;
          notifications: NotificationState;
          goals: GoalState;
        }>;

        if (parsed.account) setAccount((prev) => ({ ...prev, ...parsed.account }));
        if (parsed.devices) setDevices((prev) => ({ ...prev, ...parsed.devices }));
        if (parsed.notifications) {
          setNotifications((prev) => ({ ...prev, ...parsed.notifications }));
        }
        if (parsed.goals) setGoals((prev) => ({ ...prev, ...parsed.goals }));
      } catch (error) {
        console.error("Failed to parse saved settings", error);
      }
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    setAccount((prev) => ({
      ...prev,
      name: session?.user?.name || prev.name,
      email: session?.user?.email || prev.email,
    }));
  }, [session?.user?.email, session?.user?.name]);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        account,
        devices,
        notifications,
        goals,
      })
    );
  }, [account, devices, goals, mounted, notifications]);

  const connectedDevices = useMemo(
    () => Object.values(devices).filter(Boolean).length,
    [devices]
  );

  const saveAccount = () => {
    toast.success("Account preferences saved locally");
  };

  const toggleDevice = (key: keyof DeviceState, label: string) => {
    setDevices((prev) => {
      const next = !prev[key];
      toast.success(next ? `${label} connected` : `${label} disconnected`);
      return { ...prev, [key]: next };
    });
  };

  const toggleNotification = (key: keyof NotificationState, label: string) => {
    setNotifications((prev) => {
      const next = !prev[key];
      toast.success(`${label} ${next ? "enabled" : "disabled"}`);
      return { ...prev, [key]: next };
    });
  };

  const saveGoals = () => {
    toast.success("Sleep goals updated");
  };

  const exportLocalData = () => {
    const payload = {
      account,
      devices,
      notifications,
      goals,
      aiConversations: JSON.parse(localStorage.getItem("sleep-conversations") || "[]"),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sleepsync-settings-export.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Settings export downloaded");
  };

  const clearAiHistory = () => {
    localStorage.removeItem("sleep-conversations");
    toast.success("AI conversation history cleared from this browser");
  };

  const resetLocalSettings = () => {
    localStorage.removeItem(SETTINGS_KEY);
    setDevices({
      appleHealth: false,
      oura: false,
      garmin: false,
    });
    setNotifications({
      bedtime: true,
      summary: true,
      streaks: true,
    });
    setGoals({
      nightlyTarget: 7.5,
      bedtimeTarget: "22:45",
      streakGoal: 14,
    });
    toast.success("Local settings reset");
  };

  return (
    <main className="premium-page min-h-screen px-6 pb-24 pt-28 text-[var(--app-text)] lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="premium-panel-strong rounded-[36px] p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">Settings</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">
            Tune SleepSync around your life, not the other way around.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--app-text-muted)]">
            Manage your account, device connections, reminders, sleep goals, and privacy controls from one calm surface that actually responds.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="premium-panel rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Connected devices</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{connectedDevices}</p>
            </div>
            <div className="premium-panel rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Nightly target</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{goals.nightlyTarget.toFixed(1)}h</p>
            </div>
            <div className="premium-panel rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Bedtime target</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{goals.bedtimeTarget}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="premium-panel-strong rounded-[34px] p-5">
            <div className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--app-accent-strong)]/12 text-[var(--app-text)]"
                        : "text-[var(--app-text-muted)] hover:bg-white/6 hover:text-[var(--app-text)]"
                    }`}
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? "bg-[var(--app-accent-strong)]/14 text-[var(--app-accent-strong)]" : "bg-white/5"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === "account" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Account</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="premium-panel rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Full name</p>
                    <input
                      value={account.name}
                      onChange={(e) => setAccount((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-3 w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                  <label className="premium-panel rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Email address</p>
                    <input
                      value={account.email}
                      onChange={(e) => setAccount((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-3 w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                  <label className="premium-panel rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Timezone</p>
                    <select
                      value={account.timezone}
                      onChange={(e) => setAccount((prev) => ({ ...prev, timezone: e.target.value }))}
                      className="mt-3 w-full bg-transparent text-sm outline-none"
                    >
                      <option value="Asia/Dhaka">Asia/Dhaka</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </label>
                  <div className="premium-panel rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Password</p>
                    <p className="mt-3 text-sm text-[var(--app-text-muted)]">Managed through your existing auth flow</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={saveAccount}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-sm font-semibold text-[#062019]"
                >
                  <Check className="h-4 w-4" />
                  Save account settings
                </button>
              </section>
            )}

            {activeTab === "devices" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Connected Devices</h2>
                <div className="mt-6 grid gap-4">
                  {[
                    ["appleHealth", "Apple Health"],
                    ["oura", "Oura"],
                    ["garmin", "Garmin"],
                  ].map(([key, label]) => {
                    const typedKey = key as keyof DeviceState;
                    const connected = devices[typedKey];

                    return (
                      <div key={label} className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                            {connected ? "Connected in this browser session state" : "Connect to enrich your sleep insights"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleDevice(typedKey, label)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                            connected
                              ? "border border-[var(--app-line)] bg-white/5 text-[var(--app-text)]"
                              : "bg-[var(--app-accent-strong)] text-[#062019]"
                          }`}
                        >
                          {connected ? <Unlink2 className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                          {connected ? "Disconnect" : "Connect"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Notification Preferences</h2>
                <div className="mt-6 space-y-4">
                  {[
                    ["bedtime", "Bedtime reminder"],
                    ["summary", "Morning sleep summary"],
                    ["streaks", "Streak milestone celebration"],
                  ].map(([key, label]) => {
                    const typedKey = key as keyof NotificationState;
                    const enabled = notifications[typedKey];

                    return (
                      <div key={label} className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="mt-1 text-sm text-[var(--app-text-muted)]">Control when SleepSync reaches out.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleNotification(typedKey, label)}
                          aria-pressed={enabled}
                          aria-label={`Toggle ${label}`}
                          className={`relative h-7 w-12 rounded-full transition-colors ${enabled ? "bg-[var(--app-accent-strong)]" : "bg-white/10"}`}
                        >
                          <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"}`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === "goals" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Sleep Goals</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <label className="premium-panel rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Nightly target</p>
                    <input
                      type="number"
                      min="4"
                      max="12"
                      step="0.5"
                      value={goals.nightlyTarget}
                      onChange={(e) => setGoals((prev) => ({ ...prev, nightlyTarget: Number(e.target.value) }))}
                      className="mt-3 w-full bg-transparent text-2xl font-semibold tracking-[-0.03em] outline-none"
                    />
                  </label>

                  <label className="premium-panel rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Bedtime target</p>
                    <input
                      type="time"
                      value={goals.bedtimeTarget}
                      onChange={(e) => setGoals((prev) => ({ ...prev, bedtimeTarget: e.target.value }))}
                      className="mt-3 w-full bg-transparent text-2xl font-semibold tracking-[-0.03em] outline-none"
                    />
                  </label>

                  <label className="premium-panel rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Streak goal</p>
                    <input
                      type="number"
                      min="3"
                      max="100"
                      step="1"
                      value={goals.streakGoal}
                      onChange={(e) => setGoals((prev) => ({ ...prev, streakGoal: Number(e.target.value) }))}
                      className="mt-3 w-full bg-transparent text-2xl font-semibold tracking-[-0.03em] outline-none"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={saveGoals}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-sm font-semibold text-[#062019]"
                >
                  <Check className="h-4 w-4" />
                  Save sleep goals
                </button>
              </section>
            )}

            {activeTab === "privacy" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Data & Privacy</h2>
                <div className="mt-6 space-y-4">
                  <div className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                    <div>
                      <p className="font-medium">Export local settings</p>
                      <p className="mt-1 text-sm text-[var(--app-text-muted)]">Download your current browser-side preferences and AI session history.</p>
                    </div>
                    <button
                      type="button"
                      onClick={exportLocalData}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>

                  <div className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                    <div>
                      <p className="font-medium">Clear AI conversation history</p>
                      <p className="mt-1 text-sm text-[var(--app-text-muted)]">Remove locally stored AI chat history from this browser.</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearAiHistory}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear
                    </button>
                  </div>

                  <div className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                    <div>
                      <p className="font-medium">Reset local settings</p>
                      <p className="mt-1 text-sm text-[var(--app-text-muted)]">Restore this browser to the default premium configuration.</p>
                    </div>
                    <button
                      type="button"
                      onClick={resetLocalSettings}
                      className="inline-flex items-center gap-2 rounded-full border border-[#F97F9A]/20 bg-[#F97F9A]/10 px-4 py-2 text-sm text-[#F97F9A]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
