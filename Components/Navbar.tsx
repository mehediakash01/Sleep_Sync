"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const avatarFallbackSrc = useMemo(() => {
    const seed = session?.user?.name || session?.user?.email || "SleepSync User";
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}`;
  }, [session?.user?.name, session?.user?.email]);

  const handleAvatarClick = () => {
    setIsProfileMenuOpen(false);
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/SleepSync.png"
              alt="sleepSync-logo"
              width={52}
              height={52}
            />
            <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">
              SleepSync
            </h1>
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
        <div className="navbar-end relative" ref={profileMenuRef}>
          {session?.user ? (
            <>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="w-12 h-12 rounded-full ring-2 ring-indigo-200 hover:ring-indigo-400 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-lg"
                title="Open profile menu"
              >
                <img
                  src={session.user.image || avatarFallbackSrc}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-14 right-0 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl p-3"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <img
                        src={session.user.image || avatarFallbackSrc}
                        alt="User avatar"
                        className="w-11 h-11 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 space-y-2">
                      <button
                        onClick={handleAvatarClick}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link href="/login">
              <button className="btn   bg-gradient-to-l from-secondary to-primary rounded-full">
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
                    <img
                      src={session.user.image || avatarFallbackSrc}
                      alt="User avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.user.email}
                      </p>
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
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        handleClose();
                        handleAvatarClick();
                      }}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-rose-50 text-rose-600 py-3 rounded-lg font-medium hover:bg-rose-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
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
