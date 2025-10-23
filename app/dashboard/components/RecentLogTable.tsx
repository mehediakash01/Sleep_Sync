import {motion} from "framer-motion"
import { Clock } from "lucide-react";
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-600" />
        Recent Sleep Logs
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quality</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bedtime</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Wake Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-900">{log.date}</td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">{log.duration}h</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.quality >= 8 ? 'bg-green-100 text-green-800' :
                    log.quality >= 6 ? 'bg-blue-100 text-blue-800' :
                    log.quality >= 4 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {log.quality}/10
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{log.bedTime}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{log.wakeTime}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}