"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", sleep: 7 },
  { day: "Tue", sleep: 6.5 },
  { day: "Wed", sleep: 8 },
  { day: "Thu", sleep: 7.3 },
  { day: "Fri", sleep: 6.8 },
  { day: "Sat", sleep: 8.2 },
  { day: "Sun", sleep: 7.5 },
];

export default function ChartCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Weekly Sleep Duration</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
