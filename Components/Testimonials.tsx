import { FaStar } from "react-icons/fa";
import Image from "next/image";
import Container from "./Container";

const Testimonials = () => {
  const testimonials = [
    {
      img: "https://randomuser.me/api/portraits/women/12.jpg",
      name: "Sarah L.",
      quote: "I reduced my insomnia by 40% with SleepSync.",
    },
    {
      img: "https://randomuser.me/api/portraits/men/10.jpg",
      name: "James R.",
      quote: "The streak tracker keeps me motivated every night!",
    },
    {
      img: "https://randomuser.me/api/portraits/women/8.jpg",
      name: "Amina K.",
      quote: "AI tips helped me finally get a consistent routine.",
    },
  ];

  return (
    <Container className="  text-white ">
      <h2 className="text-4xl font-bold text-center mb-12">
        Sleep Stories from Our Users
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="p-6 bg-white text-gray-800 rounded-2xl shadow-md hover:shadow-lg transition text-center"
          >
            <Image
              src={t.img}
              alt={t.name}
              width={80}
              height={80}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">{t.name}</h3>

            {/* Star Rating */}
            <div className="flex justify-center mb-3 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <p className="text-sm text-gray-600 italic">“{t.quote}”</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Testimonials;
