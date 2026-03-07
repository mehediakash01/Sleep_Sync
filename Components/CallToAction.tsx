"use client"
import Container from "./Container";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { FaFireAlt } from "react-icons/fa";

const CallToAction = () => {
  return (
    <div className="relative overflow-hidden">
      {/* decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <Container className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative text-center space-y-7"
        >
          {/* flame icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
              <FaFireAlt className="text-4xl text-orange-300 drop-shadow-lg" />
            </div>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready to Sleep Smarter?<br />
            <span className="text-white/70">Your best night starts tonight.</span>
          </h2>

          <p className="text-white/70 text-lg max-w-lg mx-auto leading-relaxed">
            Join thousands of people already sleeping better with SleepSync.
            Free forever. No credit card needed.
          </p>

          {/* Star rating */}
          <div className="flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-300 fill-yellow-300" />
            ))}
            <span className="text-white/60 text-xs ml-2">4.9 · Loved by 45,000+ users</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-800 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              Sign Up Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/15 border border-white/30 text-white font-semibold hover:bg-white/25 transition-all duration-200"
            >
              Already have an account?
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default CallToAction;
