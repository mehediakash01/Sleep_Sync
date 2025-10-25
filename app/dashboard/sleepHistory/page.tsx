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

  if (loading) return    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sleep Log...</p>
        </div>
      </div>
  if (!session) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-gray-600 text-lg">Please log in to view your dashboard.</p>
      </div>

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
              {logs.map((log,index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
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
