"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Bell,
  Check,
  Database,
  Download,
  Goal,
  Link2,
  LoaderCircle,
  ShieldCheck,
  Trash2,
  Unlink2,
  UserRound,
} from "lucide-react";

const tabs = [
  { id: "account", label: "Account", icon: UserRound },
  { id: "devices", label: "Connected Devices", icon: Database },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "goals", label: "Sleep Goals", icon: Goal },
  { id: "privacy", label: "Data & Privacy", icon: ShieldCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];
type DeviceState = Record<"appleHealth" | "oura" | "garmin", boolean>;
type AccountState = { name: string; email: string; timezone: string };
type GoalState = { nightlyTarget: number; bedtimeTarget: string; streakGoal: number };
type NotificationState = {
  emailEnabled: boolean;
  bedtimeReminder: boolean;
  bedtimeHour: number;
  bedtimeMinute: number;
  poorSleepAlert: boolean;
  streakAlert: boolean;
};

const DEVICE_KEY = "sleep-sync-device-settings";
const DEFAULT_NOTIFICATIONS: NotificationState = {
  emailEnabled: true,
  bedtimeReminder: false,
  bedtimeHour: 22,
  bedtimeMinute: 30,
  poorSleepAlert: true,
  streakAlert: true,
};

const timeValue = (hour: number, minute: number) =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const parseTimeValue = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  return {
    hour: Number.isFinite(hour) ? hour : 22,
    minute: Number.isFinite(minute) ? minute : 30,
  };
};

function StatusChip({ loading, saving }: { loading: boolean; saving: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">
      {(loading || saving) && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
      {loading ? "Loading sync state" : saving ? "Saving" : "Synced"}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState<TabId>("account");
  const [mounted, setMounted] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [account, setAccount] = useState<AccountState>({ name: "", email: "", timezone: "UTC" });
  const [goals, setGoals] = useState<GoalState>({
    nightlyTarget: 7.5,
    bedtimeTarget: "22:45",
    streakGoal: 14,
  });
  const [devices, setDevices] = useState<DeviceState>({
    appleHealth: false,
    oura: false,
    garmin: false,
  });
  const [notifications, setNotifications] = useState<NotificationState>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    const saved = localStorage.getItem(DEVICE_KEY);
    if (saved) {
      try {
        setDevices((prev) => ({ ...prev, ...(JSON.parse(saved) as Partial<DeviceState>) }));
      } catch (error) {
        console.error("Failed to parse local device settings", error);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(DEVICE_KEY, JSON.stringify(devices));
  }, [devices, mounted]);

  useEffect(() => {
    setAccount((prev) => ({
      ...prev,
      name: session?.user?.name || prev.name,
      email: session?.user?.email || prev.email,
    }));
  }, [session?.user?.email, session?.user?.name]);

  useEffect(() => {
    if (status !== "authenticated") {
      const loading = status === "loading";
      setProfileLoading(loading);
      setNotificationLoading(loading);
      return;
    }

    let cancelled = false;
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await fetch("/api/profile-settings", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to load profile settings");
        const data = (await response.json()) as Partial<AccountState & GoalState>;
        if (cancelled) return;
        setAccount((prev) => ({
          ...prev,
          name: data.name ?? prev.name,
          email: data.email ?? prev.email,
          timezone: data.timezone ?? prev.timezone,
        }));
        setGoals((prev) => ({
          nightlyTarget: data.nightlyTarget ?? prev.nightlyTarget,
          bedtimeTarget: data.bedtimeTarget ?? prev.bedtimeTarget,
          streakGoal: data.streakGoal ?? prev.streakGoal,
        }));
      } catch (error) {
        console.error(error);
        if (!cancelled) toast.error("Couldn't load synced profile settings");
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    const loadNotifications = async () => {
      try {
        setNotificationLoading(true);
        const response = await fetch("/api/notification-settings", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to load notification settings");
        const data = (await response.json()) as Partial<NotificationState>;
        if (!cancelled) setNotifications((prev) => ({ ...prev, ...DEFAULT_NOTIFICATIONS, ...data }));
      } catch (error) {
        console.error(error);
        if (!cancelled) toast.error("Couldn't load synced notification settings");
      } finally {
        if (!cancelled) setNotificationLoading(false);
      }
    };

    void Promise.all([loadProfile(), loadNotifications()]);
    return () => {
      cancelled = true;
    };
  }, [status]);

  const connectedDevices = useMemo(() => Object.values(devices).filter(Boolean).length, [devices]);

  const saveProfile = async (payload: Partial<AccountState & GoalState>, successMessage: string) => {
    setProfileSaving(true);
    try {
      const response = await fetch("/api/profile-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save profile settings");
      const saved = (await response.json()) as Partial<AccountState & GoalState>;
      setAccount((prev) => ({
        ...prev,
        name: saved.name ?? prev.name,
        email: saved.email ?? prev.email,
        timezone: saved.timezone ?? prev.timezone,
      }));
      setGoals((prev) => ({
        nightlyTarget: saved.nightlyTarget ?? prev.nightlyTarget,
        bedtimeTarget: saved.bedtimeTarget ?? prev.bedtimeTarget,
        streakGoal: saved.streakGoal ?? prev.streakGoal,
      }));
      await update?.();
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save synced profile settings");
    } finally {
      setProfileSaving(false);
    }
  };

  const saveNotifications = async (nextState: NotificationState, successMessage: string) => {
    const previous = notifications;
    setNotifications(nextState);
    setNotificationSaving(true);
    try {
      const response = await fetch("/api/notification-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(nextState),
      });
      if (!response.ok) throw new Error("Failed to save notification settings");
      const saved = (await response.json()) as Partial<NotificationState>;
      setNotifications((prev) => ({ ...prev, ...DEFAULT_NOTIFICATIONS, ...saved }));
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      setNotifications(previous);
      toast.error("Couldn't save notification settings");
    } finally {
      setNotificationSaving(false);
    }
  };

  const accountFields = (
    <section className="premium-panel-strong rounded-[34px] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">Account</h2>
        <StatusChip loading={profileLoading} saving={profileSaving} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="premium-panel rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Full name</p>
          <input value={account.name} onChange={(e) => setAccount((prev) => ({ ...prev, name: e.target.value }))} className="mt-3 w-full bg-transparent text-sm outline-none" />
        </label>
        <label className="premium-panel rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Email address</p>
          <input value={account.email} readOnly className="mt-3 w-full cursor-not-allowed bg-transparent text-sm text-[var(--app-text-muted)] outline-none" />
        </label>
        <label className="premium-panel rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Timezone</p>
          <select value={account.timezone} onChange={(e) => setAccount((prev) => ({ ...prev, timezone: e.target.value }))} className="mt-3 w-full bg-transparent text-sm outline-none">
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
          </select>
        </label>
        <div className="premium-panel rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Password</p>
          <p className="mt-3 text-sm text-[var(--app-text-muted)]">Managed through your existing auth flow.</p>
        </div>
      </div>
      <button type="button" onClick={() => void saveProfile({ name: account.name, timezone: account.timezone }, "Account settings synced")} disabled={profileLoading || profileSaving} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-sm font-semibold text-[#062019] disabled:cursor-not-allowed disabled:opacity-60">
        <Check className="h-4 w-4" />
        Save account settings
      </button>
    </section>
  );

  return (
    <main className="premium-page min-h-screen px-6 pb-24 pt-28 text-[var(--app-text)] lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="premium-panel-strong rounded-[36px] p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">Settings</p>
            <span className="rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Account and goals sync to your profile</span>
            <span className="rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Notifications sync to your account</span>
            <span className="rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Devices are local until wearable OAuth lands</span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">Tune SleepSync around your life, not the other way around.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--app-text-muted)]">Profile details, timezone, and goals now persist to your account. Notification preferences also sync, and bedtime reminders are ready for scheduled server runs instead of needing an open tab.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="premium-panel rounded-[24px] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Connected devices</p><p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{connectedDevices}</p></div>
            <div className="premium-panel rounded-[24px] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Nightly target</p><p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{goals.nightlyTarget.toFixed(1)}h</p></div>
            <div className="premium-panel rounded-[24px] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Reminder time</p><p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{timeValue(notifications.bedtimeHour, notifications.bedtimeMinute)}</p></div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="premium-panel-strong rounded-[34px] p-5">
            <div className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${activeTab === id ? "bg-[var(--app-accent-strong)]/12 text-[var(--app-text)]" : "text-[var(--app-text-muted)] hover:bg-white/6 hover:text-[var(--app-text)]"}`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${activeTab === id ? "bg-[var(--app-accent-strong)]/14 text-[var(--app-accent-strong)]" : "bg-white/5"}`}><Icon className="h-4 w-4" /></span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === "account" && accountFields}

            {activeTab === "devices" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em]">Connected Devices</h2>
                  <span className="rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--app-text-muted)]">UI-ready, not wearable-synced yet</span>
                </div>
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
                          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{connected ? "Marked as connected in this browser. Real wearable OAuth is the next step." : "Ready for a real device integration flow."}</p>
                        </div>
                        <button type="button" onClick={() => setDevices((prev) => ({ ...prev, [typedKey]: !prev[typedKey] }))} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${connected ? "border border-[var(--app-line)] bg-white/5 text-[var(--app-text)]" : "bg-[var(--app-accent-strong)] text-[#062019]"}`}>
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">Notification Preferences</h2>
                    <p className="mt-2 text-sm text-[var(--app-text-muted)]">These settings are synced to your account and used by the live notification system and cron reminders.</p>
                  </div>
                  <StatusChip loading={notificationLoading} saving={notificationSaving} />
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    ["emailEnabled", "Email updates"],
                    ["bedtimeReminder", "Bedtime reminder"],
                    ["poorSleepAlert", "Poor sleep alerts"],
                    ["streakAlert", "Streak celebrations"],
                  ].map(([key, label]) => {
                    const typedKey = key as keyof Pick<NotificationState, "emailEnabled" | "bedtimeReminder" | "poorSleepAlert" | "streakAlert">;
                    const enabled = notifications[typedKey];
                    return (
                      <div key={label} className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="mt-1 text-sm text-[var(--app-text-muted)]">Control what SleepSync actually sends for this account.</p>
                        </div>
                        <button type="button" onClick={() => void saveNotifications({ ...notifications, [typedKey]: !enabled }, `${label} ${!enabled ? "enabled" : "disabled"}`)} disabled={notificationLoading || notificationSaving} className={`relative h-7 w-12 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${enabled ? "bg-[var(--app-accent-strong)]" : "bg-white/10"}`} aria-label={`Toggle ${label}`} aria-pressed={enabled}>
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"}`} />
                        </button>
                      </div>
                    );
                  })}
                  <div className="premium-panel rounded-[24px] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">Preferred reminder time</p>
                        <p className="mt-1 text-sm text-[var(--app-text-muted)]">This now feeds the scheduled server reminder sweep instead of depending on an open tab.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <input type="time" value={timeValue(notifications.bedtimeHour, notifications.bedtimeMinute)} onChange={(e) => { const next = parseTimeValue(e.target.value); setNotifications((prev) => ({ ...prev, bedtimeHour: next.hour, bedtimeMinute: next.minute })); }} className="rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-sm text-[var(--app-text)] outline-none" />
                        <button type="button" onClick={() => void saveNotifications(notifications, "Reminder time updated")} disabled={notificationLoading || notificationSaving} className="inline-flex items-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-[#062019] disabled:cursor-not-allowed disabled:opacity-60">
                          <Check className="h-4 w-4" />
                          Save time
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "goals" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em]">Sleep Goals</h2>
                  <StatusChip loading={profileLoading} saving={profileSaving} />
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <label className="premium-panel rounded-[24px] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Nightly target</p><input type="number" min="4" max="12" step="0.5" value={goals.nightlyTarget} onChange={(e) => setGoals((prev) => ({ ...prev, nightlyTarget: Number(e.target.value) }))} className="mt-3 w-full bg-transparent text-2xl font-semibold tracking-[-0.03em] outline-none" /></label>
                  <label className="premium-panel rounded-[24px] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Bedtime target</p><input type="time" value={goals.bedtimeTarget} onChange={(e) => setGoals((prev) => ({ ...prev, bedtimeTarget: e.target.value }))} className="mt-3 w-full bg-transparent text-2xl font-semibold tracking-[-0.03em] outline-none" /></label>
                  <label className="premium-panel rounded-[24px] p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Streak goal</p><input type="number" min="3" max="100" step="1" value={goals.streakGoal} onChange={(e) => setGoals((prev) => ({ ...prev, streakGoal: Number(e.target.value) }))} className="mt-3 w-full bg-transparent text-2xl font-semibold tracking-[-0.03em] outline-none" /></label>
                </div>
                <button type="button" onClick={() => void saveProfile(goals, "Sleep goals synced")} disabled={profileLoading || profileSaving} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-sm font-semibold text-[#062019] disabled:cursor-not-allowed disabled:opacity-60">
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
                    <div><p className="font-medium">Export local and synced settings</p><p className="mt-1 text-sm text-[var(--app-text-muted)]">Download your current profile, notifications, local device placeholders, and AI session history.</p></div>
                    <button type="button" onClick={() => { const payload = { account, goals, notifications, devices, aiConversations: JSON.parse(localStorage.getItem("sleep-conversations") || "[]") }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "sleepsync-settings-export.json"; link.click(); URL.revokeObjectURL(url); toast.success("Settings export downloaded"); }} className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-sm"><Download className="h-4 w-4" />Export</button>
                  </div>
                  <div className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                    <div><p className="font-medium">Clear AI conversation history</p><p className="mt-1 text-sm text-[var(--app-text-muted)]">Remove locally stored AI chat history from this browser.</p></div>
                    <button type="button" onClick={() => { localStorage.removeItem("sleep-conversations"); toast.success("AI conversation history cleared from this browser"); }} className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-sm"><Trash2 className="h-4 w-4" />Clear</button>
                  </div>
                  <div className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                    <div><p className="font-medium">Reset local device placeholders</p><p className="mt-1 text-sm text-[var(--app-text-muted)]">Restore only the browser-side device toggles. Synced account settings remain intact.</p></div>
                    <button type="button" onClick={() => { localStorage.removeItem(DEVICE_KEY); setDevices({ appleHealth: false, oura: false, garmin: false }); toast.success("Local device placeholders reset"); }} className="inline-flex items-center gap-2 rounded-full border border-[#F97F9A]/20 bg-[#F97F9A]/10 px-4 py-2 text-sm text-[#F97F9A]"><Trash2 className="h-4 w-4" />Reset</button>
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
