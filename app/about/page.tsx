"use client";

import Container from "@/Components/Container";
import { motion } from "framer-motion";
import Image from "next/image";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -200 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        className="bg-gradient-to-b from-primary/10 to-white py-20 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          About SleepSync
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Your trusted companion in understanding and improving sleep quality —
          powered by science, data, and design.
        </p>
      </motion.section>

      {/* Mission & Vision Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -400 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        >
          <Image
            src="/images/sleepSyncTeam.jpg"
            alt="SleepSync Team"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg object-cover"
          />
        </motion.div>

        <div className="space-y-6">
          <motion.div  initial={{ opacity: 0, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeInOut" }}>
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At <span className="font-semibold text-primary">SleepSync</span>,
              our mission is to empower individuals to take control of their sleep
              habits and live healthier, more energized lives. We believe that
              quality sleep fuels productivity, creativity, and emotional
              well-being.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
          >
            <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where technology and mindfulness coexist —
              helping people reconnect with their natural sleep rhythms. Our
              platform uses data-driven insights and simple interfaces to make
              better sleep achievable for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-20">
        <Container className=" text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Our Core Values
          </h2>

          <motion.div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation",
                desc: "We blend cutting-edge sleep research with technology to deliver real, measurable impact.",
                icon: "💡",
              },
              {
                title: "Empathy",
                desc: "We care deeply about the human experience — behind every data point is a person.",
                icon: "💖",
              },
              {
                title: "Transparency",
                desc: "We prioritize honesty and clarity in how we collect, use, and present your sleep data.",
                icon: "🔍",
              },
            ].map((value, i) => (
              <motion.div 

                key={i}
                 initial={{ opacity: 0, y: 50 }} // start faded and down
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: i * 0.2, // delay each card a bit
              ease: "easeOut",
            }}
            viewport={{ once: false, amount: 0.3 }}
                className="bg-gray-50 border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.h2 initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} transition={{duration:0.6,ease:"easeIn"}} className="text-3xl font-bold mb-6 text-gray-800">Our Story</motion.h2>
        <motion.p initial={{opacity:0,y:70}} whileInView={{opacity:1,y:0}} transition={{duration:0.6, delay:0.1,ease:"easeIn"}} className="text-gray-600 leading-relaxed text-lg">
          SleepSync was born out of frustration and curiosity. Our founders — a
          team of developers, neuroscientists, and wellness enthusiasts —
          realized that most sleep apps track data but fail to help people truly
          understand it. So we set out to build a smarter solution that
          interprets, educates, and motivates.
        </motion.p>
        <motion.p initial={{opacity:0,y:90}} whileInView={{opacity:1,y:0}} transition={{duration:0.6, delay:0.2,ease:"easeIn"}} className="text-gray-600 leading-relaxed mt-4 text-lg">
          Today, SleepSync serves thousands of users worldwide, bridging the gap
          between data and better rest.
        </motion.p>
      </section>

      {/* Meet the Team */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Meet the Team
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              {
                name: " Mehedi Akash",
                role: "Founder & Lead Developer",
                img: "https://randomuser.me/api/portraits/men/22.jpg",
              },
              {
                name: "Sarah Lee",
                role: "Sleep Research Specialist",
                img: "https://randomuser.me/api/portraits/women/5.jpg",
              },
              {
                name: "James Park",
                role: "UX Designer",
                img: "https://randomuser.me/api/portraits/men/19.jpg",
              },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="mx-auto rounded-full object-cover mb-4"
                />
                <h3 className="font-semibold text-lg text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-primary text-white">
        <h2 className="text-3xl font-bold mb-4">
          Join the Sleep Revolution 🌙
        </h2>
        <p className="text-lg mb-6">
          Start tracking, improving, and understanding your sleep today.
        </p>
        <button className="btn bg-white text-primary hover:bg-gray-200">
          Get Started
        </button>
      </section>
    </div>
  );
}
