"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "./Container";

export const WhySleepMatters = () => {
 
  

  return (
    <Container>
      <motion.div
      initial={{opacity:0,x:-200}}
      whileInView={{opacity:1,x:0}}
      viewport={{once:false,amount:0.3}}
      transition={{duration:0.6,ease:"easeInOut"}}
        className="flex flex-col lg:flex-row justify-between items-center"
      >
        <div className="space-y-8">
          <h1 className="text-5xl font-bold">Why Sleep Matters?</h1>

          <div className="grid grid-cols-1 gap-6 text-left max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <p>
                <span className="font-semibold">Boosts Brain Power</span> – Sleep strengthens memory, focus, and decision-making.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">❤️</span>
              <p>
                <span className="font-semibold">Supports Heart Health</span> – Reduces risk of high blood pressure and heart disease.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <p>
                <span className="font-semibold">Improves Productivity</span> – Rested minds are sharper, more creative, and efficient.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🙂</span>
              <p>
                <span className="font-semibold">Reduces Stress & Anxiety</span> – Quality sleep balances hormones and mood.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <p>
                <span className="font-semibold">Strengthens Immunity</span> – Helps the body fight off illness and recover faster.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <p>
                <span className="font-semibold">Regulates Body Clock</span> – A consistent sleep cycle improves energy and daily rhythm.
              </p>
            </div>
          </div>
        </div>

        <motion.div
         initial={{opacity:0, x: 400}}
      whileInView={{opacity:1,x:0}}
      viewport={{once:false,amount:0.3}}
      transition={{duration:0.8,ease:"easeInOut"}}
        >
          <Image
            src="/images/brainHeart.png"
            width={550}
            height={450}
            alt="brain and Heart"
          />
        </motion.div>
      </motion.div>
    </Container>
  );
};
