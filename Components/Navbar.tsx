"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleAvatarClick = () => {
    router.push("/dashboard");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/Streak", label: "Streak" },
    { href: "/notification", label: "Notification" },
    { href: "/AiCoach", label: "AI Coach" },
    { href: "/about", label: "About Us" },
    { href: "/blogs", label: "Blog" },
  ];

  return (
    <>
      <nav className="navbar  backdrop-blur-md py-4 fixed z-50 px-6 lg:px-24 ">
        <div className="navbar-start">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/images/SleepSync.png"
              alt="sleepSync-logo"
              width={52}
              height={52}
            />
            <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">SleepSync</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 font-medium transition-all duration-200 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600"
                    }`}
                  >
                    {item.label}
                    {/* Active indicator underline */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Avatar / Login Button */}
        <div className="navbar-end">
          {session?.user ? (
            <button
              onClick={handleAvatarClick}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
              title="Go to Dashboard"
            >
              {session.user.email?.[0].toUpperCase()}
            </button>
          ) : (
            <Link href="/login">
              <button className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none rounded-full px-6 transition-all duration-200 hover:shadow-lg">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
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
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/SleepSync.png"
                    alt="sleepSync-logo"
                    width={40}
                    height={40}
                  />
                  <h2 className="text-xl font-bold text-gray-900">SleepSync</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* User Info (if logged in) */}
              {session?.user && (
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-lg">
                      {session.user.email?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-sm text-gray-600">{session.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;

                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-indigo-50 text-indigo-600 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex-1">{item.label}</span>
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Drawer Footer - Login/Dashboard Button */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                {session?.user ? (
                  <button
                    onClick={() => {
                      handleClose();
                      handleAvatarClick();
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <Link href="/login" onClick={handleClose}>
                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};