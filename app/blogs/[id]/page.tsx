import React, { useState } from "react";
import { useRouter } from "next/router";

import { Blog } from "../../types/blog";
import { blogs } from "@/data/blog";
import { CommentSection } from "@/Components/CommentSection";
import { SuggestedPosts } from "@/Components/SuggestedPost";

const BlogPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const blog: Blog | undefined = blogs.find((b) => b.id === Number(id));

  const [likes, setLikes] = useState(blog?.likeCount || 0);
  const [comments, setComments] = useState(blog?.comments || []);

  if (!blog) return <p className="text-center py-20">Loading...</p>;

  const handleLike = () => setLikes(likes + 1);
  const handleComment = (message: string) => {
    setComments([...comments, { user: "Guest", message, date: new Date().toLocaleDateString() }]);
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center justify-between text-gray-500 mb-6">
          <span>By {blog.author}</span>
          <span>{blog.postedDate}</span>
          <span>{likes} Likes</span>
        </div>
        <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <p className="mb-6 whitespace-pre-line">{blog.content}</p>
        <div className="flex gap-4 mb-8">
          <button onClick={handleLike} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Like</button>
          <button onClick={handleShare} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Share</button>
        </div>

        {/* Comments */}
        <CommentSection comments={comments} onAddComment={handleComment} />
      </div>

      {/* Suggested Blogs */}
      <SuggestedPosts currentId={blog.id} blogs={blogs} />
    </div>
  );
};

export default BlogPage;
