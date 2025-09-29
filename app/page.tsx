
import { Banner } from "@/Components/Banner";
import Features from "@/Components/Features";
import Streaks from "@/Components/Streaks";
import { WhySleepMatters } from "@/Components/WhySleepMatters";


export default function Home() {
  return (
   <div  >
<div className="bg-gradient-to-tl from-secondary to-primary">
  <Banner></Banner>
  <WhySleepMatters></WhySleepMatters>
  <Features></Features>
  <Streaks></Streaks>
</div>

   </div>
  );
}
