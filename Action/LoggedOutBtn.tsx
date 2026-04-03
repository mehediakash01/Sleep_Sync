"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

const LoggedOutBtn = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2.5 text-sm font-medium text-[#F97F9A] transition-colors duration-300 hover:bg-[#F97F9A]/10"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </motion.button>
  );
};

export default LoggedOutBtn;
