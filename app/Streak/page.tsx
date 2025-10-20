// app/streak/page.tsx
"use client";

import { motion } from "framer-motion";

export default function StreakPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">
          Sleep Streaks
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Track your consistency, unlock rewards, and build healthy sleep habits.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            🚀 Coming Soon
          </h2>
          <p className="text-gray-500">
            We’re building your personalized streak tracker to visualize your
            sleep progress over time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
