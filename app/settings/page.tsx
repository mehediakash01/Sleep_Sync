"use client";

import { useState } from "react";
import { Bell, Database, Goal, ShieldCheck, UserRound } from "lucide-react";

const tabs = [
  { id: "account", label: "Account", icon: UserRound },
  { id: "devices", label: "Connected Devices", icon: Database },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "goals", label: "Sleep Goals", icon: Goal },
  { id: "privacy", label: "Data & Privacy", icon: ShieldCheck },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("account");

  return (
    <main className="premium-page min-h-screen px-6 pb-24 pt-28 text-[var(--app-text)] lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="premium-panel-strong rounded-[36px] p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">Settings</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">
            Tune SleepSync around your life, not the other way around.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--app-text-muted)]">
            Manage your account, future device connections, reminders, sleep goals, and privacy preferences from one calm control surface.
          </p>
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
                  {["Full name", "Email address", "Password", "Timezone"].map((field) => (
                    <div key={field} className="premium-panel rounded-[24px] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">{field}</p>
                      <p className="mt-3 text-sm text-[var(--app-text)]">Presentation-ready settings card</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "devices" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Connected Devices</h2>
                <div className="mt-6 grid gap-4">
                  {["Apple Health", "Oura", "Garmin"].map((device) => (
                    <div key={device} className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                      <div>
                        <p className="font-medium">{device}</p>
                        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Connection-ready slot for wearable syncing</p>
                      </div>
                      <button type="button" className="rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-sm">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Notification Preferences</h2>
                <div className="mt-6 space-y-4">
                  {["Bedtime reminder", "Morning sleep summary", "Streak milestone celebration"].map((item, index) => (
                    <div key={item} className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Control when SleepSync reaches out.</p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Toggle ${item}`}
                        className={`relative h-7 w-12 rounded-full ${index !== 1 ? "bg-[var(--app-accent-strong)]" : "bg-white/10"}`}
                      >
                        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${index !== 1 ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "goals" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Sleep Goals</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {["7.5 hours target", "10:45 PM bedtime", "14-night streak goal"].map((goal) => (
                    <div key={goal} className="premium-panel rounded-[24px] p-4">
                      <p className="text-sm font-medium">{goal}</p>
                      <p className="mt-2 text-sm text-[var(--app-text-muted)]">Goal card styled to match the premium system.</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "privacy" && (
              <section className="premium-panel-strong rounded-[34px] p-6">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Data & Privacy</h2>
                <div className="mt-6 space-y-4">
                  {["Export sleep data", "Manage AI conversation history", "Delete account data"].map((item) => (
                    <div key={item} className="premium-panel flex items-center justify-between rounded-[24px] p-4">
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Trust-first controls for your health data.</p>
                      </div>
                      <button type="button" className="rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-sm">
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
