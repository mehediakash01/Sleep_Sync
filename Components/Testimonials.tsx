"use client"
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import Container from "./Container";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Sarah L.",
    role: "Marketing Manager",
    quote: "I reduced my insomnia by 40% within just 3 weeks. SleepSync changed my life.",
    x: -200,
  },
  {
    img: "https://randomuser.me/api/portraits/men/10.jpg",
    name: "James R.",
    role: "Software Engineer",
    quote: "The streak tracker keeps me motivated every single night. I haven't missed a log in 60 days!",
    x: 0,
  },
  {
    img: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Amina K.",
    role: "University Student",
    quote: "AI tips helped me finally get a consistent sleep routine. My grades improved too!",
    x: 200,
  },
];

const Testimonials = () => {
  return (
    <Container>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl font-extrabold text-white">
          Sleep Stories{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/60 to-white">
            from Our Users
          </span>
        </h2>
        <p className="text-white/60 mt-3 text-sm max-w-sm mx-auto">
          Real people, real results. Here's what our community says.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: t.x }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.13, ease: "easeOut" }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="relative p-7 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
          >
            {/* Quote icon */}
            <Quote size={28} className="text-[#89CFF0]/40 absolute top-5 right-5" />

            {/* Stars */}
            <div className="flex gap-0.5 text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>

            {/* Quote text */}
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <Image
                src={t.img}
                alt={t.name}
                width={44}
                height={44}
                className="rounded-full ring-2 ring-[#89CFF0]/40"
              />
              <div>
                <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default Testimonials;
