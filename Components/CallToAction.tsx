"use client"
import Image from "next/image";
import Container from "./Container";
import {motion} from "framer-motion"
const CallToAction = () => {
  return (
    <Container className=" grid grid-cols-1 lg:grid-cols-2 gap-12 items-center  text-black ">
      {/* Left Side */}
      <motion.div
      initial={{opacity:0,x:-200}}
      whileInView={{opacity:1,x:0}}
      viewport={{once:false,amount:0.3}}
      transition={{duration:0.6,ease:"easeInOut"}}
       className="text-center lg:text-left">
        <h2 className="text-4xl font-bold mb-4">Ready to Sleep Smarter?</h2>
        <p className="text-lg mb-6">
          Start tracking your sleep today and build healthier habits for life.
        </p>
      <button  className="btn   bg-gradient-to-l from-secondary to-primary rounded-full">
        sign Up free
          </button>
      </motion.div>

      {/* Right Side Illustration */}
      <motion.div initial={{opacity:0,x:200}}
      whileInView={{opacity:1,x:0}}
      viewport={{once:false,amount:0.3}}
      transition={{duration:0.6,ease:"easeInOut"}} className="flex justify-center lg:justify-end">
        <Image
          src="/images/bedroom.png"
          alt="Cozy Bedroom"
          width={400}
          height={400}
          
        />
      </motion.div>
    </Container>
  );
};

export default CallToAction;
