import { FaRegClock, FaChartLine, FaFireAlt, FaRobot } from "react-icons/fa";
import Container from "./Container";

const Features = () => {
  const features = [
    {
      icon: <FaRegClock className="text-4xl text-purple-500" />,
      title: "Daily Sleep Log",
      desc: "Keep track of your bedtime and wake-up time effortlessly.",
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-500" />,
      title: "Smart Insights",
      desc: "Visualize your sleep data with clear and simple charts.",
    },
    {
      icon: <FaFireAlt className="text-4xl text-orange-500" />,
      title: "Streak Tracker",
      desc: "Stay consistent by maintaining healthy sleep streaks.",
    },
    {
      icon: <FaRobot className="text-4xl text-green-500" />,
      title: "AI Sleep Coach",
      desc: "Get personalized tips powered by AI to improve your sleep.",
    },
  ];

  return (
    <Container >
      <h2 className="text-4xl text-white font-bold text-center mb-12">
        Features <span className="">& How It Works</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Features;
