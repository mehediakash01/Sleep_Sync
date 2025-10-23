"use client";
import LoggedOutBtn from "@/Action/LoggedOutBtn";
import { Home, BarChart2, Users, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { name: "Overview", icon: <Home size={18} />, href: "/dashboard" },
  { name: "SleepLog", icon: <Users size={18} />, href: "/dashboard/sleepTracking" },

{ name: "Sleep Insights", icon: <BarChart2 size={18} />, href: "/dashboard/sleepInsights" },

  { name: "Sleep History", icon: <Clock size={18} />, href: "/dashboard/sleepHistory" },

];

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
           <Link href={'/'}>
             <div className="flex items-center justify-center">
                 <Image
                   src="/images/SleepSync.png"
                   alt="sleepSync-logo"
                   width={40}
                   height={40}
                 ></Image>
                 <h1 className="text-lg font-bold  ">SleepSync</h1>
               </div>
           </Link>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
        <div className="border-t pt-4">
        <LoggedOutBtn/>
      </div>
    </div>
  );
}
