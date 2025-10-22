
import { motion } from "framer-motion";
import {
 
  PieChart,
  Pie,
  Cell,
  
  Tooltip,
  ResponsiveContainer,
  
} from "recharts";
import { Sparkles } from "lucide-react";

// Types
type SleepLog = {
  date: string;
  duration: number;
  quality: number;
  bedTime: string;
  wakeTime: string;
};

export default function SleepQualityDistribution({ data }: { data: SleepLog[] }) {
  const qualityData = [
    { name: "Excellent (8-10)", value: data.filter(d => d.quality >= 8).length, color: "#10B981" },
    { name: "Good (6-7)", value: data.filter(d => d.quality >= 6 && d.quality < 8).length, color: "#3B82F6" },
    { name: "Fair (4-5)", value: data.filter(d => d.quality >= 4 && d.quality < 6).length, color: "#F59E0B" },
    { name: "Poor (0-3)", value: data.filter(d => d.quality < 4).length, color: "#EF4444" },
  ].filter(d => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        Sleep Quality Distribution
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={qualityData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => `${entry.name}: ${entry.value}`}
            labelLine={false}
          >
            {qualityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}