import React from "react";

import { useRouter } from "next/router";
import { Blog } from "@/app/types/blog";

interface SuggestedPostsProps {
  currentId: number;
  blogs: Blog[];
}

export const SuggestedPosts: React.FC<SuggestedPostsProps> = ({ currentId, blogs }) => {
  const router = useRouter();
  const suggested = blogs.filter((b) => b.id !== currentId).slice(0, 2);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Suggested Posts</h2>
      {suggested.map((s) => (
        <div key={s.id} className="mb-6 p-4 border rounded-lg hover:shadow-lg transition">
          <img src={s.image} alt={s.title} className="w-full h-32 object-cover rounded mb-2" />
          <h3 className="font-semibold">{s.title}</h3>
          <span className="text-gray-500 text-sm">By {s.author}</span>
          <button onClick={() => router.push(`/blogs/${s.id}`)} className="mt-2 text-blue-600 hover:underline">
            Read More
          </button>
        </div>
      ))}
    </div>
  );
};
