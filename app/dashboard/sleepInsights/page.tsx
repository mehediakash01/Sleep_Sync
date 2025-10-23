"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type SleepLog = {
  date: string;
  duration: number;
  quality: number;
  timeInBed: string;
  wakeUpTime: string;
};

type Stats = {
  avgDuration: number;
  avgQuality: number;
  avgBedTime: string;
  avgWakeTime: string;
};

export default function SleepInsights() {
  const { data: session } = useSession();
  const [data, setData] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    avgDuration: 0,
    avgQuality: 0,
    avgBedTime: "--:--",
    avgWakeTime: "--:--",
  });

  // Helper function to extract time in 12-hour format with AM/PM from datetime string
  const extractTime = (dateTimeString: string): string => {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateTimeString);
        return "12:00 AM";
      }
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error extracting time:", error);
      return "12:00 AM";
    }
  };

  // Convert time string to minutes since midnight
  const timeToMinutes = (timeString: string): number => {
    try {
      // Parse both 12-hour and 24-hour formats
      const date = new Date(`1970-01-01 ${timeString}`);
      if (isNaN(date.getTime())) return 0;
      return date.getHours() * 60 + date.getMinutes();
    } catch (error) {
      console.error("Error converting time to minutes:", error);
      return 0;
    }
  };

  // Convert minutes since midnight to 12-hour format with AM/PM
  const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60) % 24;
    const m = Math.round(minutes % 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  useEffect(() => {
    const fetchLogs = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/sleepLogs?email=${session.user.email}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch logs: ${res.status}`);
        }
        
        const logs = await res.json();

        if (!Array.isArray(logs) || logs.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const formatted: SleepLog[] = logs
          .map((log: any) => {
            try {
              const start = new Date(log.timeInBed);
              const end = new Date(log.wakeUpTime);
              
              // Validate dates
              if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                console.warn("Invalid date in log:", log);
                return null;
              }

              let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              
              // Handle overnight sleep
              if (duration < 0) duration += 24;
              
              // Reasonable sleep duration check (0-24 hours)
              if (duration < 0 || duration > 24) {
                console.warn("Unrealistic duration:", duration, log);
                return null;
              }

              return {
                date: new Date(log.dateOfSession).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                }),
                duration: Number(duration.toFixed(2)),
                quality: Number(log.sleepQuality) || 0,
                timeInBed: extractTime(log.timeInBed),
                wakeUpTime: extractTime(log.wakeUpTime),
              };
            } catch (error) {
              console.error("Error processing log:", error, log);
              return null;
            }
          })
          .filter((log): log is SleepLog => log !== null); // Remove invalid entries

        if (formatted.length > 0) {
          // Calculate averages
          const avgDuration =
            formatted.reduce((sum, d) => sum + d.duration, 0) / formatted.length;
          
          const avgQuality =
            formatted.reduce((sum, d) => sum + d.quality, 0) / formatted.length;

          // Convert times to minutes for averaging
          const bedTimeMinutes = formatted.map(d => timeToMinutes(d.timeInBed));
          const wakeTimeMinutes = formatted.map(d => timeToMinutes(d.wakeUpTime));

          const avgBedMinutes =
            bedTimeMinutes.reduce((sum, min) => sum + min, 0) / bedTimeMinutes.length;
          
          const avgWakeMinutes =
            wakeTimeMinutes.reduce((sum, min) => sum + min, 0) / wakeTimeMinutes.length;

          setStats({
            avgDuration: Number(avgDuration.toFixed(1)),
            avgQuality: Number(avgQuality.toFixed(1)),
            avgBedTime: minutesToTime(avgBedMinutes),
            avgWakeTime: minutesToTime(avgWakeMinutes),
          });

          // Show last 7 days
          setData(formatted.slice(-7));
        }
      } catch (error) {
        console.error("Error fetching sleep logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [session]);

 if (loading) return    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sleep Insights...</p>
        </div>
      </div>
  if (!session) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-gray-600 text-lg">Please log in to view your sleepInsights.</p>
      </div>


  if (data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          💤 Sleep Insights
        </h2>
        <p className="text-center mt-10 text-gray-500">
          No sleep data available yet. Start logging your sleep to see insights!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.h2
        className="text-3xl font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💤 Sleep Insights
      </motion.h2>

      {/* Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <StatCard title="Avg Duration" value={`${stats.avgDuration} hrs`} color="blue" />
        <StatCard title="Avg Quality" value={`${stats.avgQuality}/10`} color="purple" />
        <StatCard title="Avg Wake Time" value={stats.avgWakeTime} color="green" />
        <StatCard title="Avg Bed Time" value={stats.avgBedTime} color="orange" />
      </motion.div>

      {/* Chart Section */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-medium mb-3 text-gray-700">
          Sleep Duration (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              label={{ value: "Hours", angle: -90, position: "insideLeft" }}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

/** 📊 Small stat card component */
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: "blue" | "purple" | "green" | "orange";
}) {
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { 
      bg: "bg-blue-50", 
      text: "text-blue-700", 
      border: "border-blue-500" 
    },
    purple: { 
      bg: "bg-purple-50", 
      text: "text-purple-700", 
      border: "border-purple-500" 
    },
    green: { 
      bg: "bg-green-50", 
      text: "text-green-700", 
      border: "border-green-500" 
    },
    orange: { 
      bg: "bg-orange-50", 
      text: "text-orange-700", 
      border: "border-orange-500" 
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      className={`p-5 rounded-xl shadow-sm bg-white hover:shadow-md transition flex flex-col gap-1 border-l-4 ${colors.border}`}
      whileHover={{ scale: 1.03 }}
    >
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <div className={`text-2xl font-bold ${colors.text}`}>
        {value}
      </div>
    </motion.div>
  );
}