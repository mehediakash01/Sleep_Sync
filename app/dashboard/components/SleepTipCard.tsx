import motion from "framer-motion";
import { Sparkles } from "lucide-react";
export default function SleepTipCard({ avgDuration }: { avgDuration: number }) {
  const getTip = () => {
    if (avgDuration < 6) {
      return "You're sleeping less than 6 hours on average. Try going to bed 1 hour earlier tonight!";
    } else if (avgDuration < 7) {
      return "Almost there! Aim for 7-9 hours of sleep for optimal health.";
    } else if (avgDuration > 9) {
      return "You're getting plenty of sleep! Make sure it's quality sleep by maintaining a consistent schedule.";
    }
    return "Great job! You're in the healthy sleep range of 7-9 hours. Keep it up!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
    >
      <div className="flex items-start gap-3">
        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">💡 Tip for You</h3>
          <p className="text-sm opacity-90 leading-relaxed">{getTip()}</p>
        </div>
      </div>
    </motion.div>
  );
}
