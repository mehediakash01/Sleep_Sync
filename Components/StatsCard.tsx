"use client";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <span className={`text-sm ${change.includes("+") ? "text-green-500" : "text-red-500"}`}>{change}</span>
    </motion.div>
  );
}
