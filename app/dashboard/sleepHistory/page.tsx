"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface SleepLog {
  _id: string;
  dateOfSession: string;
  timeInBed: string;
  wakeUpTime: string;
  sleepQuality: string;
  mood: string;
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

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!session) return <p className="text-center mt-8">Please log in to view logs.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🛏️ Sleep Log History</h2>
      {logs.length === 0 ? (
        <p>No sleep logs found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Time in Bed</th>
                <th className="p-3">Wake-up Time</th>
                <th className="p-3">Sleep Quality</th>
                <th className="p-3">Mood</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(log.dateOfSession).toLocaleDateString()}</td>
                  <td className="p-3">{log.timeInBed}</td>
                  <td className="p-3">{log.wakeUpTime}</td>
                  <td className="p-3">{log.sleepQuality}</td>
                  <td className="p-3">{log.mood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
