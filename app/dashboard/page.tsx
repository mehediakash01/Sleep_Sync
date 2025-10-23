"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


import WelcomeHeader from "./components/WelcomeHeader";
import QuickStats from "./components/QuickStates";
import SleepTrendChart from "./components/SleepTrendChart";
import SleepQualityDistribution from "./components/SleepQualityChart";
import StreakTrack from "./components/StreakTrack";
import SleepTipCard from "./components/SleepTipCard";
import RecentLogTable from "./components/RecentLogTable";

// Types
type SleepLog = {
  date: string;
  duration: number;
  quality: number;
  bedTime: string;
  wakeTime: string;
};

type DashboardStats = {
  lastNightDuration: string;
  lastNightQuality: number;
  currentStreak: number;
  avgBedTime: string;
  avgWakeTime: string;
  avgDuration: number;
  avgQuality: number;
};

// Main Dashboard Component
export default function DashboardOverview() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    lastNightDuration: "--",
    lastNightQuality: 0,
    currentStreak: 0,
    avgBedTime: "--:--",
    avgWakeTime: "--:--",
    avgDuration: 0,
    avgQuality: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/sleepLogs?email=${session.user.email}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const logs = await res.json();
        if (!Array.isArray(logs) || logs.length === 0) {
          setLoading(false);
          return;
        }

        // Process logs
        const processed = logs.map((log: any) => {
          const start = new Date(log.timeInBed);
          const end = new Date(log.wakeUpTime);
          let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          if (duration < 0) duration += 24;

          return {
            date: new Date(log.dateOfSession).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            duration: Number(duration.toFixed(1)),
            quality: Number(log.sleepQuality) || 0,
            bedTime: new Date(log.timeInBed).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            wakeTime: new Date(log.wakeUpTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
          };
        }).filter(log => log.duration > 0 && log.duration < 24);

        setSleepLogs(processed.slice(-7)); // Last 7 days

        // Calculate stats
        if (processed.length > 0) {
          const lastNight = processed[processed.length - 1];
          const avgDur = processed.reduce((sum, l) => sum + l.duration, 0) / processed.length;
          const avgQual = processed.reduce((sum, l) => sum + l.quality, 0) / processed.length;

          // Calculate streak (simplified - consecutive days)
          let streak = 1;
          for (let i = processed.length - 1; i > 0; i--) {
            const curr = new Date(processed[i].date);
            const prev = new Date(processed[i - 1].date);
            const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) streak++;
            else break;
          }

          setStats({
            lastNightDuration: `${lastNight.duration}h`,
            lastNightQuality: lastNight.quality,
            currentStreak: streak,
            avgBedTime: lastNight.bedTime,
            avgWakeTime: lastNight.wakeTime,
            avgDuration: Number(avgDur.toFixed(1)),
            avgQuality: Number(avgQual.toFixed(1)),
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-gray-600 text-lg">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sleep data...</p>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <WelcomeHeader name={session.user?.name || "Sleeper"} greeting={greeting()} />

        {/* Quick Stats Grid */}
        <QuickStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Charts (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <SleepTrendChart data={sleepLogs} />
            <SleepQualityDistribution data={sleepLogs} />
          </div>

          {/* Right Column - Side Info (1/3 width) */}
          <div className="space-y-6">
            <StreakTrack streak={stats.currentStreak} />
            <SleepTipCard avgDuration={stats.avgDuration} />
          </div>
        </div>

        {/* Recent Logs Table */}
        <RecentLogTable logs={sleepLogs.slice(-5)} />
      </div>
    </div>
  );
}
