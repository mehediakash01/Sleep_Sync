
import AiSleepCoach from "@/Components/AiSleepCoach";
import { Banner } from "@/Components/Banner";
import CallToAction from "@/Components/CallToAction";
import FAQ from "@/Components/FAQ";
import Features from "@/Components/Features";
import HowItWorks from "@/Components/HowItWorks";
import SleepStats from "@/Components/SleepStats";
import Streaks from "@/Components/Streaks";
import Testimonials from "@/Components/Testimonials";
import { WhySleepMatters } from "@/Components/WhySleepMatters";

export default function Home() {
  return (
    <div>
      {/* === GRADIENT SECTIONS === */}
      <div className="bg-gradient-to-tl from-secondary to-primary">
        <Banner />
        <WhySleepMatters />
        <Features />
      </div>

      {/* === WHITE BREAK: Stats + How It Works === */}
      <SleepStats />
      <HowItWorks />

      {/* === GRADIENT: Streaks + AI Coach + Testimonials === */}
      <div className="bg-gradient-to-tl from-secondary to-primary">
        <Streaks />
        <AiSleepCoach />
        <Testimonials />
      </div>

      {/* === WHITE BREAK: FAQ === */}
      <FAQ />

      {/* === GRADIENT: Final CTA === */}
      <div className="bg-gradient-to-tl from-secondary to-primary">
        <CallToAction />
      </div>
    </div>
  );
}
