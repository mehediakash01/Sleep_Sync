import { Award, Moon, Sparkles, TrendingUp } from "lucide-react";
import {motion} from "framer-motion"
type DashboardStats = {
  lastNightDuration: string;
  lastNightQuality: number;
  currentStreak: number;
  avgBedTime: string;
  avgWakeTime: string;
  avgDuration: number;
  avgQuality: number;
};
export default function QuickStats({ stats }: { stats: DashboardStats }) {
  const statCards = [
    {
      title: "Last Night",
      value: stats.lastNightDuration,
      subtitle: "Sleep Duration",
      icon: Moon,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Sleep Quality",
      value: `${stats.lastNightQuality}/10`,
      subtitle: stats.lastNightQuality >= 7 ? "Great!" : "Could be better",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      subtitle: "🔥 Keep it up!",
      icon: Award,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Avg Duration",
      value: `${stats.avgDuration}h`,
      subtitle: "Weekly Average",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`bg-gradient-to-br ${card.color} p-2 rounded-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
          <p className="text-xs text-gray-500">{card.subtitle}</p>
        </motion.div>
      ))}
    </div>
  );
}
