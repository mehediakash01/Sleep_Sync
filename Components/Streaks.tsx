"use client";
import { FaFireAlt, FaMedal, FaStar, FaTrophy } from "react-icons/fa";
import Container from "./Container";
import { easeIn, motion } from "framer-motion";
const Streaks = () => {
  return (
    <Container className="  text-center   ">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold mb-4">
          Stay Consistent, <span className="text-blue-400">Build Streaks</span>
        </h2>
        <p className="text-gray-600 mb-10">
          Motivation to keep your sleep schedule on track – like Duolingo
          streaks, but for your health!
        </p>
      </motion.div>

      {/* Streak Stat */}
      <div
        
        className="flex flex-col items-center mb-12"
      >
        <FaFireAlt className="text-6xl text-orange-400 animate-pulse mb-4" />
        <h3 className="text-2xl font-semibold">
    
          You completed 25 nights in a row!
        </h3>

        {/* Progress Bar */}
        <div
         
          className="w-full max-w-lg bg-gray-200 rounded-full h-4 mt-6"
        >
          <div
            className="bg-orange-400 h-4 rounded-full"
            style={{ width: "75%" }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">75% to your next milestone</p>
      </div>

      {/* Achievement Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 p-6">
        <motion.div
          initial={{ opacity: 0, x: -220 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeIn }}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
        >
          <FaMedal className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h4 className="font-semibold text-lg">7-Day Champ</h4>
          <p className="text-gray-600 text-sm">
            Complete your first week streak
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -220 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, ease: easeIn }}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
        >
          <FaStar className="text-5xl text-blue-500 mx-auto mb-4" />
          <h4 className="font-semibold text-lg">Consistency Star</h4>
          <p className="text-gray-600 text-sm">Stay on track for 30 days</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -220 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, ease: easeIn }}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
        >
          <FaTrophy className="text-5xl text-green-500 mx-auto mb-4" />
          <h4 className="font-semibold text-lg">Sleep Master</h4>
          <p className="text-gray-600 text-sm">Achieve 100+ nights streak</p>
        </motion.div>
      </div>
    </Container>
  );
};

export default Streaks;
