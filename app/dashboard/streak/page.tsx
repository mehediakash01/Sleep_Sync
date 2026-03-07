"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  CalendarDays,
  TrendingUp,
  Lock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────
interface LoggedDate {
  date: string; // "YYYY-MM-DD"
  quality: number;
  duration: number | null;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalNights: number;
  loggedDates: LoggedDate[];
}

// ──────────────────────────────────────────
// Milestones config
// ──────────────────────────────────────────
const MILESTONES = [
  { days: 3,   label: "3-Day Starter",     emoji: "🌱", color: "from-green-400 to-emerald-500" },
  { days: 7,   label: "7-Day Champ",       emoji: "🥉", color: "from-yellow-400 to-amber-500"  },
  { days: 14,  label: "2-Week Warrior",    emoji: "🥈", color: "from-blue-400 to-cyan-500"      },
  { days: 30,  label: "Monthly Master",    emoji: "🥇", color: "from-orange-400 to-red-500"     },
  { days: 60,  label: "Sleep Enthusiast",  emoji: "🔥", color: "from-purple-400 to-fuchsia-500" },
  { days: 100, label: "Sleep Legend",      emoji: "🏆", color: "from-pink-500 to-rose-600"      },
];

// ──────────────────────────────────────────
// Heatmap helpers
// ──────────────────────────────────────────
function buildHeatmapWeeks(loggedDates: LoggedDate[], weeksCount = 24) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start on the most recent Sunday, going back weeksCount weeks
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - today.getDay() - (weeksCount - 1) * 7);

  const logMap = new Map<string, number>(
    loggedDates.map((l) => [l.date, l.quality])
  );

  const weeks: { date: Date; quality: number | null; key: string }[][] = [];

  const cursor = new Date(startDay);
  for (let w = 0; w < weeksCount; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const key = cursor.toISOString().split("T")[0];
      const isFuture = cursor > today;
      week.push({
        date: new Date(cursor),
        quality: isFuture ? null : (logMap.get(key) ?? -1),
        key,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function qualityColor(quality: number | null) {
  if (quality === null) return "bg-gray-100"; // future
  if (quality === -1)   return "bg-gray-100"; // no log
  if (quality <= 1)     return "bg-red-200";
  if (quality === 2)    return "bg-orange-200";
  if (quality === 3)    return "bg-yellow-300";
  if (quality === 4)    return "bg-green-300";
  return "bg-emerald-500";                    // 5
}

function qualityLabel(quality: number | null) {
  if (quality === null || quality === -1) return "No log";
  const labels = ["", "Very Poor", "Poor", "Fair", "Good", "Excellent"];
  return labels[quality] ?? "Unknown";
}

// Month labels
function getMonthLabels(weeks: ReturnType<typeof buildHeatmapWeeks>) {
  const labels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = week[0].date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: week[0].date.toLocaleString("default", { month: "short" }),
        colIndex: i,
      });
      lastMonth = month;
    }
  });
  return labels;
}

// ──────────────────────────────────────────
// Component
// ──────────────────────────────────────────
export default function StreakPage() {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/streak")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#89CFF0]" />
      </div>
    );
  }

  const streak = data?.currentStreak ?? 0;
  const longest = data?.longestStreak ?? 0;
  const total = data?.totalNights ?? 0;

  // Next milestone
  const nextMilestone = MILESTONES.find((m) => m.days > streak);
  const progressToNext = nextMilestone
    ? Math.min((streak / nextMilestone.days) * 100, 100)
    : 100;

  const weeks = buildHeatmapWeeks(data?.loggedDates ?? []);
  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="space-y-6 pb-10">
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Sleep Streaks</h1>
        <p className="text-sm text-gray-500 mt-1">
          Stay consistent — every night counts.
        </p>
      </motion.div>

      {/* ── Top stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center justify-center text-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={streak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-5xl mb-1">🔥</div>
              <p className="text-6xl font-extrabold leading-none">{streak}</p>
              <p className="text-sm mt-1 opacity-90 font-medium">
                Day{streak !== 1 ? "s" : ""} Current Streak
              </p>
            </motion.div>
          </AnimatePresence>
          {nextMilestone && (
            <div className="w-full mt-4">
              <div className="flex justify-between text-[11px] opacity-80 mb-1">
                <span>{streak} days</span>
                <span>Next: {nextMilestone.days}d</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Longest streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center"
        >
          <Trophy size={32} className="text-amber-500 mb-2" />
          <p className="text-5xl font-extrabold text-gray-800">{longest}</p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Longest Streak</p>
        </motion.div>

        {/* Total nights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center"
        >
          <CalendarDays size={32} className="text-[#89CFF0] mb-2" />
          <p className="text-5xl font-extrabold text-gray-800">{total}</p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Nights Logged</p>
        </motion.div>
      </div>

      {/* ── Heatmap ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-[#89CFF0]" />
          <h2 className="font-semibold text-gray-800">Sleep Activity</h2>
          <span className="ml-auto text-xs text-gray-400">Last 24 weeks</span>
        </div>

        {/* Month labels */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex mb-1 relative" style={{ paddingLeft: "28px" }}>
              {monthLabels.map(({ label, colIndex }) => (
                <div
                  key={`${label}-${colIndex}`}
                  className="text-[10px] text-gray-400 absolute"
                  style={{ left: `${28 + colIndex * 14}px` }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Day-of-week labels + grid */}
            <div className="flex gap-0">
              {/* DOW labels */}
              <div className="flex flex-col gap-[2px] mr-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div
                    key={i}
                    className="w-[10px] h-[10px] text-[9px] text-gray-400 flex items-center justify-center"
                  >
                    {i % 2 === 1 ? d : ""}
                  </div>
                ))}
              </div>

              {/* Week columns */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((cell) => (
                      <div
                        key={cell.key}
                        className={`w-[10px] h-[10px] rounded-sm ${qualityColor(cell.quality)} cursor-default transition-transform hover:scale-125`}
                        onMouseEnter={(e) => {
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          const formatted = cell.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                          setTooltip({
                            text:
                              cell.quality !== null && cell.quality >= 0
                                ? `${formatted} · ${qualityLabel(cell.quality)}`
                                : `${formatted} · No log`,
                            x: rect.left + window.scrollX,
                            y: rect.top + window.scrollY - 32,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-3 justify-end">
              <span className="text-[10px] text-gray-400">Less</span>
              {[-1, 2, 3, 4, 5].map((q) => (
                <div
                  key={q}
                  className={`w-[10px] h-[10px] rounded-sm ${qualityColor(q)}`}
                />
              ))}
              <span className="text-[10px] text-gray-400">More</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fixed tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 pointer-events-none bg-gray-800 text-white text-[11px] px-2 py-1 rounded-lg shadow-lg"
            style={{ top: tooltip.y, left: tooltip.x }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Milestone Badges ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-5">
          <Trophy size={18} className="text-amber-500" />
          <h2 className="font-semibold text-gray-800">Milestone Badges</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MILESTONES.map((m, i) => {
            const unlocked = longest >= m.days;
            return (
              <motion.div
                key={m.days}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.28 + i * 0.06, type: "spring", stiffness: 200 }}
                className={`relative flex flex-col items-center p-4 rounded-2xl border text-center transition-all duration-200 ${
                  unlocked
                    ? "border-transparent shadow-md bg-gradient-to-br " + m.color + " text-white"
                    : "border-gray-100 bg-gray-50 text-gray-400"
                }`}
              >
                {/* Lock / check overlay */}
                <div className="absolute top-2 right-2">
                  {unlocked ? (
                    <CheckCircle2 size={14} className="text-white/80" />
                  ) : (
                    <Lock size={12} className="text-gray-300" />
                  )}
                </div>

                <div className={`text-3xl mb-1 ${unlocked ? "" : "grayscale opacity-40"}`}>
                  {m.emoji}
                </div>
                <p className={`text-xs font-semibold leading-tight ${unlocked ? "text-white" : "text-gray-500"}`}>
                  {m.label}
                </p>
                <p className={`text-[11px] mt-0.5 ${unlocked ? "text-white/80" : "text-gray-400"}`}>
                  {m.days} days
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
