"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Clock, Sunrise, Star, Smile, CalendarDays, BedDouble } from "lucide-react";
import Link from "next/link";

interface SleepLog {
  _id: string;
  dateOfSession: string;
  timeInBed: string;
  wakeUpTime: string;
  sleepQuality: string;
  mood: string;
}

const QUALITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  "1": { label: "Very Poor",  color: "text-red-500",     bg: "bg-red-50"     },
  "2": { label: "Poor",       color: "text-orange-500",  bg: "bg-orange-50"  },
  "3": { label: "Average",    color: "text-yellow-600",  bg: "bg-yellow-50"  },
  "4": { label: "Good",       color: "text-[#89CFF0]",   bg: "bg-[#89CFF0]/10" },
  "5": { label: "Excellent",  color: "text-emerald-600", bg: "bg-emerald-50" },
};

function QualityBadge({ value }: { value: string }) {
  const cfg = QUALITY_CONFIG[value] ?? { label: value, color: "text-gray-500", bg: "bg-gray-100" };
  const dots = Math.min(Number(value) || 0, 5);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
      {Array.from({ length: dots }).map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
      ))}
      {cfg.label}
    </span>
  );
}

export default function SleepLogHistory() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/sleepLogs?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setLogs(data))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#f5f0ff]">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] animate-spin mx-auto mb-4"
          style={{ clipPath: "inset(25% 25% 25% 25% round 50%)" }} />
        <p className="text-gray-500 text-sm font-medium">Loading your sleep history…</p>
      </div>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#f5f0ff]">
      <div className="text-center">
        <Moon size={40} className="text-[#89CFF0] mx-auto mb-3" />
        <p className="text-gray-600 text-lg font-medium">Please log in to view your sleep history.</p>
        <Link href="/login" className="mt-4 inline-block btn bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white border-0 rounded-full px-6">
          Log In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] to-[#f5f0ff] pb-16">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8 px-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <BedDouble size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white leading-tight">Sleep History</h1>
              <p className="text-white/80 text-sm mt-0.5">
                {logs.length} session{logs.length !== 1 ? "s" : ""} logged
              </p>
            </div>
          </div>

          {/* Summary chips */}
          {logs.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: CalendarDays, label: `Latest: ${new Date(logs[0].dateOfSession).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` },
                { icon: Star,         label: `Avg Quality: ${(logs.reduce((s, l) => s + Number(l.sleepQuality), 0) / logs.length).toFixed(1)}/5` },
                { icon: Moon,         label: `${logs.filter(l => Number(l.sleepQuality) >= 4).length} good nights` },
              ].map((chip, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/25">
                  <chip.icon size={11} />
                  {chip.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8">

        {/* ── Empty state ── */}
        {logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#89CFF0]/15 flex items-center justify-center mx-auto mb-4">
              <Moon size={36} className="text-[#89CFF0]" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No sleep logs yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start tracking your sleep to see your history here.</p>
            <Link href="/dashboard/sleepTracking"
              className="btn bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white border-0 rounded-full px-8">
              Log Your First Session
            </Link>
          </motion.div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm overflow-hidden">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-[#89CFF0]/10 to-[#B19CD9]/10 border-b border-gray-100">
                    {[
                      { icon: CalendarDays, label: "Date"         },
                      { icon: Clock,        label: "Time in Bed"  },
                      { icon: Sunrise,      label: "Wake-up Time" },
                      { icon: Star,         label: "Quality"      },
                      { icon: Smile,        label: "Mood"         },
                    ].map(({ icon: Icon, label }) => (
                      <th key={label} className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5">
                          <Icon size={13} className="text-[#89CFF0]" />
                          {label}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <motion.tr
                      key={log._id ?? i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="border-b border-gray-50 hover:bg-[#89CFF0]/5 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-700">
                        {new Date(log.dateOfSession).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{log.timeInBed}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{log.wakeUpTime}</td>
                      <td className="px-5 py-3.5"><QualityBadge value={log.sleepQuality} /></td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{log.mood}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="md:hidden space-y-3">
              {logs.map((log, i) => (
                <motion.div
                  key={log._id ?? i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.28 }}
                  className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-800">
                      {new Date(log.dateOfSession).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                    <QualityBadge value={log.sleepQuality} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> {log.timeInBed}</span>
                    <span className="flex items-center gap-1"><Sunrise size={11} /> {log.wakeUpTime}</span>
                    <span className="flex items-center gap-1 col-span-2"><Smile size={11} /> {log.mood}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
