"use client";
import { FaRegClock, FaChartLine, FaFireAlt, FaRobot } from "react-icons/fa";
import Container from "./Container";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const features = [
    {
      icon: <FaRegClock className="text-4xl text-secondary" />,
      title: "Daily Sleep Log",
      desc: "Keep track of your bedtime and wake-up time effortlessly.",
    },
    {
      icon: <FaChartLine className="text-4xl text-primary" />,
      title: "Smart Insights",
      desc: "Visualize your sleep data with clear and simple charts.",
    },
    {
      icon: <FaFireAlt className="text-4xl text-orange-500" />,
      title: "Streak Tracker",
      desc: "Stay consistent by maintaining healthy sleep streaks.",
    },
    {
      icon: <FaRobot className="text-4xl text-green-500" />,
      title: "AI Sleep Coach",
      desc: "Get personalized tips powered by AI to improve your sleep.",
    },
  ];

  return (
    <Container>
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 80 }} // start below & invisible
        animate={isInView ? { opacity: 1, y: 0 } : {}} // animate when in view
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl  font-bold text-center mb-12"
      >
        Features <span className="">& How It Works</span>
      </motion.h2>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 80 }} // start below & invisible
        animate={isInView ? { opacity: 1, y: 0 } : {}} // animate when in view
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </Container>
  );
};

export default Features;
