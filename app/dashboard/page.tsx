"use client";

import ChartCard from "@/Components/ChartCard";

import Sidebar from "@/Components/Sidebar";
import { useState } from "react";

export default function DashHome() {
 const [isOpen, setIsOpen] = useState (false);
  const stats = [
    { title: "Total Sleep (Week)", value: "48h", change: "+5%" },
    { title: "Avg Sleep Quality", value: "84%", change: "+3%" },
    { title: "Longest Sleep", value: "8h 12m", change: "+1%" },
    { title: "Bedtime Consistency", value: "92%", change: "+6%" },
  ];

  return (
    <div className="space-y-6 grid grid-cols-2 ">
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}></Sidebar>
      <div>
        <h1 className="text-2xl font-bold">Good Evening, Akash 🌙</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-gray-500 text-sm">{s.title}</h3>
              <p className="text-2xl font-semibold mt-2">{s.value}</p>
              <span className="text-green-500 text-xs">{s.change}</span>
            </div>
          ))}
        </div>
        {/* Chart */}
        <ChartCard />
      </div>
    </div>
  );
}
