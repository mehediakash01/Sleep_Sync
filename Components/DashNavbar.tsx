"use client";

import { motion, AnimatePresence } from "framer-motion";
import LoggedOutBtn from "@/Action/LoggedOutBtn";
import { Home, BarChart2, Users, Clock, Moon, X, Menu } from "lucide-react";

import { useState } from "react";
import Link from "next/link";

export default function DashNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const menuItems = [
  { name: "Overview", icon: <Home size={18} />, href: "/dashboard" },
  { name: "SleepLog", icon: <Users size={18} />, href: "/dashboard/sleepTracking" },

{ name: "Sleep Insights", icon: <BarChart2 size={18} />, href: "/dashboard/sleepInsights" },

  { name: "Sleep History", icon: <Clock size={18} />, href: "/dashboard/sleepHistory" },

];

  return (
    <>
      <header className="flex lg:hidden items-center justify-between bg-white px-4 py-3 shadow-md sticky top-0 z-40">
        <button
          onClick={handleToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>

        <h1 className="text-lg font-semibold text-gray-900">Dashboard Overview</h1>

        <div className="flex items-center gap-3">
          
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
          <span className="hidden sm:block font-medium text-gray-700">Akash</span>
        </div>
      </header>

      {/* Drawer Component with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Sleep Sync</h2>
                    <p className="text-xs text-gray-500">Track your sleep</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              {/* <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Akash</p>
                    <p className="text-sm text-gray-600">akash@example.com</p>
                  </div>
                </div>
              </div> */}

              {/* Navigation Menu */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={handleClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
                      >
                        <span className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" >{item.icon} </span>
                        <span className="font-medium text-gray-700 group-hover:text-indigo-600">
                          {item.name}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-200">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full group"
                >
                  <LoggedOutBtn></LoggedOutBtn>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}