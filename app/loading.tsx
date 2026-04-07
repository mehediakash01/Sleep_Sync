import { RouteLoading } from "@/Components/fallbacks/RouteLoading";

export default function Loading() {
  return (
    <RouteLoading
      badge="Loading Page"
      title="Switching over to the next sleep view."
      description="We’re loading the next page with the same calm, premium experience so navigation never feels abrupt."
    />
  );
}
