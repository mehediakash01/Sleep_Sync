
import { Banner } from "@/Components/Banner";
import { WhySleepMatters } from "@/Components/WhySleepMatters";
import Image from "next/image";

export default function Home() {
  return (
   <div className="bg-gradient-to-tl from-secondary to-primary" >
<Banner></Banner>
<WhySleepMatters></WhySleepMatters>
   </div>
  );
}
