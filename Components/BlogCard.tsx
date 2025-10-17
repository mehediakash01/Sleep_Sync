import React from "react";
import Link from "next/link";
import { Blog } from "@/app/types/blog";


interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
        <p className="text-gray-600 mb-4">{blog.excerpt}</p>
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>By {blog.author}</span>
          <span>{blog.postedDate}</span>
        </div>
        <Link href={`/blogs/${blog.id}`}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};
