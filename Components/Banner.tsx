"use client";
import Image from "next/image";
import React from "react";
import Container from "./Container";
import { SleepTrackBtn } from "@/Action/SleepTrackBtn";
import { motion } from "framer-motion";
export const Banner = () => {
  return (
    <Container className="pt-16">
      <section className="flex flex-col lg:flex-row justify-between items-center  ">
        <motion.div
          initial={{ opacity: 0, x: -200 }}
         whileInView={{opacity:1,x:0}}
          transition={{ duration: 0.6 , ease:"easeInOut"}}
          className="space-y-8"
        >
          <h1 className=" font-bold text-2xl lg:text-6xl">
            Build Smarter <br /> Solutions with AI <br /> & Modern Web
          </h1>
          <p>
            Monitor your sleep, stay on track, and unlock <br />
            AI-powered insights for deeper, healthier rest.
          </p>

          <SleepTrackBtn></SleepTrackBtn>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 200 }}
         whileInView={{opacity:1,x:0}}
          transition={{ duration: 0.6 , ease:"easeInOut"}} className="lg:mt-6">
          <Image
            src="/images/heroBg.png"
            alt="girl sleeping in bed"
            width={500}
            height={500}
          ></Image>
        </motion.div>
      </section>
    </Container>
  );
};
