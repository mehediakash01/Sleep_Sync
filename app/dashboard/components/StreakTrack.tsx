import {motion} from "framer-motion"
import { Award } from "lucide-react";
export default function StreakTrack({ streak }: { streak: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white"
    >
      <div className="text-center">
        <Award className="w-12 h-12 mx-auto mb-3 opacity-90" />
        <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
        <p className="text-5xl font-bold mb-2">{streak}</p>
        <p className="text-sm opacity-90">Days 🔥</p>
        <p className="text-xs mt-4 opacity-75">Keep logging daily to maintain your streak!</p>
      </div>
    </motion.div>
  );
}