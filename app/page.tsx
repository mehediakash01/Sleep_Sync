
import AiSleepCoach from "@/Components/AiSleepCoach";
import { Banner } from "@/Components/Banner";
import CallToAction from "@/Components/CallToAction";
import FAQ from "@/Components/FAQ";
import Features from "@/Components/Features";
import HowItWorks from "@/Components/HowItWorks";
import KnowledgeHubSection from "@/Components/KnowledgeHubSection";
import SleepStats from "@/Components/SleepStats";
import Streaks from "@/Components/Streaks";
import Testimonials from "@/Components/Testimonials";
import { WhySleepMatters } from "@/Components/WhySleepMatters";

export default function Home() {
  return (
    <div className="bg-gradient-to-tl from-secondary to-primary">
      <Banner />
      <WhySleepMatters />
      <Features />
      <SleepStats />
      <HowItWorks />
      <Streaks />
      <AiSleepCoach />
      <KnowledgeHubSection />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </div>
  );
}
