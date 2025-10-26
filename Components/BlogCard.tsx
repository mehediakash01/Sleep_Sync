import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, Calendar, User, ArrowRight } from "lucide-react";
import { Blog } from "@/app/types/blog";

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={blog.image} 
          alt={blog.title} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </span>
        </div>

        {/* Like Count Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span className="text-sm font-medium text-gray-700">{blog.likeCount}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
          {/* Author */}
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{blog.author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.postedDate)}</span>
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime}</span>
          </div>
        </div>

        {/* Read More Button */}
        <Link href={`/blogs/${blog.id}`}>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 group/btn">
            Read More
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};
