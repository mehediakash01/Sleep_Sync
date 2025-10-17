import { BlogCard } from "@/Components/BlogCard";
import { blogs } from "@/data/blog";
import React from "react";


const BlogList: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold mb-8 text-center">SleepSync Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
