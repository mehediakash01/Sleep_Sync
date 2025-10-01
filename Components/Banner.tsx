import Image from "next/image";
import React from "react";
import Container from "./Container";

export const Banner = () => {
  return (
    <Container className="pt-16">
      <section className="flex flex-col lg:flex-row justify-between items-center  ">
        <div className="space-y-8">
          <h1 className=" font-bold text-2xl lg:text-6xl">
          Build Smarter <br /> Solutions with AI <br /> & Modern Web
          </h1>
          <p >
            Monitor your sleep, stay on track, 
            and unlock <br />AI-powered insights 
            for deeper, healthier rest.
          </p>

          <button className="btn   bg-gradient-to-l from-secondary to-primary rounded-full">
           Start Tracking Sleep
          </button>
        </div>
        <div className="lg:mt-6">
          <Image
            src="/images/heroBg.png"
            alt="girl sleeping in bed"
            width={500}
            height={500}
          ></Image>
        </div>
      </section>
    </Container>
  );
};
