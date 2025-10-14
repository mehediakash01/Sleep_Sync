"use client";

import ChartCard from "@/Components/ChartCard";
import StatsCard from "@/Components/StatsCard";


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Users" value="1,245" change="+12%" />
        <StatsCard title="Revenue" value="$34,560" change="+8%" />
        <StatsCard title="Policies Sold" value="342" change="+5%" />
        <StatsCard title="Active Agents" value="48" change="-2%" />
      </div>

      <ChartCard />
    </div>
  );
}
