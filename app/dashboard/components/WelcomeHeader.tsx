import {motion} from "framer-motion"
import { Moon } from "lucide-react";

 export default function WelcomeHeader({ name, greeting }: { name: string; greeting: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
          <Moon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {name}! 😴
          </h1>
          <p className="text-gray-600 text-sm"> Here is how you have been sleeping lately</p>
        </div>
      </div>
    </motion.div>
  );
}