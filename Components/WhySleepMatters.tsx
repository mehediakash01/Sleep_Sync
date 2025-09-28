import React from "react";
import Container from "./Container";
import { IoIosHeartEmpty } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { CiFaceSmile } from "react-icons/ci";
import Image from "next/image";
export const WhySleepMatters = () => {
  return (
    <Container className="my-20">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div className="space-y-8">
          <h1 className="text-5xl font-bold text-accent">Why Sleep Matters?</h1>
          <p className="text-accent  mb-8">
            Quality sleep is the foundation of better health and daily <br />
            performance. Here’s why building a healthy sleep routine matters:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto text-accent">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <p>
                <span className="font-semibold">Boosts Brain Power</span> –
                Sleep strengthens memory, focus, and decision-making.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">❤️</span>
              <p>
                <span className="font-semibold">Supports Heart Health</span> –
                Reduces risk of high blood pressure and heart disease.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <p>
                <span className="font-semibold">Improves Productivity</span> –
                Rested minds are sharper, more creative, and efficient.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🙂</span>
              <p>
                <span className="font-semibold">Reduces Stress & Anxiety</span>{" "}
                – Quality sleep balances hormones and mood.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <p>
                <span className="font-semibold">Strengthens Immunity</span> –
                Helps the body fight off illness and recover faster.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <p>
                <span className="font-semibold">Regulates Body Clock</span> – A
                consistent sleep cycle improves energy and daily rhythm.
              </p>
            </div>
          </div>
        </div>
        <div>
          <Image
            src="/images/brainHeart.png"
            width={550}
            height={450}
            alt="brain and Heart"
          ></Image>
        </div>
      </div>
    </Container>
  );
};
