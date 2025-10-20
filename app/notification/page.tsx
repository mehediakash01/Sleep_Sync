// app/notifications/page.tsx
"use client";

import { Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-indigo-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <div className="flex justify-center mb-4">
          <Bell className="w-14 h-14 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">
          Notifications
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Stay updated with personalized sleep reminders and insights.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            🔔 Feature Under Development
          </h2>
          <p className="text-gray-500">
            Soon, you’ll be able to receive bedtime reminders, sleep goal alerts,
            and smart insights directly in your dashboard.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
