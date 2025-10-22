import motion from "framer-motion"
type SleepLog = {
  date: string;
  duration: number;
  quality: number;
  bedTime: string;
  wakeTime: string;
};
export default function RecentLogTable({ logs }: { logs: SleepLog[] }) {
  if (logs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sleep Logs</h3>
        <p className="text-gray-500 text-center py-8">No sleep logs yet. Start tracking your sleep!</p>
      </motion.div>
    );
  }
}