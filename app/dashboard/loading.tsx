import { RouteLoading } from "@/Components/fallbacks/RouteLoading";

export default function Loading() {
  return (
    <RouteLoading
      badge="Loading Dashboard"
      title="Bringing your sleep data into focus."
      description="Charts, streaks, and recovery insights are loading so the dashboard feels ready the moment it appears."
    />
  );
}
