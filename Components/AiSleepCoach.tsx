"use client"
import Image from "next/image";
import Container from "./Container";
import { AskAiBtn } from "@/Action/AskAiBtn";
import {easeInOut, motion} from "framer-motion"
const AiSleepCoach = () => {
  return (
    <Container className=" grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <motion.div  initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }} className="text-center lg:text-left">
        <h2 className="text-4xl font-bold mb-4">
          Your Personal <span className="text-blue-500">AI Sleep Coach</span>
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Get personalized insights and actionable tips to improve your sleep schedule. 
          Our AI coach learns from your habits and guides you toward better rest, one night at a time.
        </p>
        <AskAiBtn/>
      </motion.div>

      {/* Right Image */}
      <div className="flex justify-center lg:justify-end">
        <Image
          src="/images/Ai.png"
          alt="AI Sleep Coach"
          width={400}
          height={400}
          className="drop-shadow-2xl rounded-xl"
        />
      </div>
    </Container>
  );
};

export default AiSleepCoach;
