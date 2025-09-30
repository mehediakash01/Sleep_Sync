import Image from "next/image";
import Container from "./Container";

const CallToAction = () => {
  return (
    <Container className=" grid grid-cols-1 lg:grid-cols-2 gap-12 items-center  text-white ">
      {/* Left Side */}
      <div className="text-center lg:text-left">
        <h2 className="text-4xl font-bold mb-4">Ready to Sleep Smarter?</h2>
        <p className="text-lg mb-6">
          Start tracking your sleep today and build healthier habits for life.
        </p>
        <button className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:scale-105 transition">
          Sign Up Free
        </button>
      </div>

      {/* Right Side Illustration */}
      <div className="flex justify-center lg:justify-end">
        <Image
          src="/images/bedroom.png"
          alt="Cozy Bedroom"
          width={400}
          height={400}
          
        />
      </div>
    </Container>
  );
};

export default CallToAction;
