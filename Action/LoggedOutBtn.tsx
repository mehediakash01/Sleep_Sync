"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LoggedOutBtn= () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login"); // Redirect after logout
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </motion.button>
  );
};

export default LoggedOutBtn;
