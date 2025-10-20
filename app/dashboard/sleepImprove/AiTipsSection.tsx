"use client";

import { useState } from "react";
import axios from "axios";

export default function AiTipsSection({ email }: { email: string }) {
  const [tips, setTips] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateTips = async () => {
    setLoading(true);
    setTips(null);
    try {
      const res = await axios.post("/api/aiTips", { email });
      setTips(res.data.tips);
    } catch (err) {
      console.error(err);
      setTips("Failed to generate tips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Sleep Tips</h2>

      <button
        onClick={handleGenerateTips}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl w-full hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Personalized Tips"}
      </button>

      {tips && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-xl text-gray-700 whitespace-pre-line">
          {tips}
        </div>
      )}
    </div>
  );
}
