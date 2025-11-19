"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  Share2, 
  Clock, 
  Calendar, 
  Eye, 
  MessageCircle, 
  ArrowLeft,
  Tag,
  User,
  Loader2
} from "lucide-react";
import Link from "next/link";

import { blogs } from "@/data/blog";
import { CommentSection } from "@/Components/CommentSection";
import { SuggestedPosts } from "@/Components/SuggestedPost";
import { Blog } from "@/app/types/blog";
import Container from "@/Components/Container";

interface BlogPageProps {
  params: { id: string };
}

const BlogPage: React.FC<BlogPageProps> = ({ params }) => {
  const blog: Blog | undefined = blogs.find((b) => b.id === Number(params.id));
  const { data: session, status } = useSession();
  const router = useRouter();

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [viewCount] = useState(blog?.viewCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Protect the page - redirect if not logged in
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    
    if (!session) {
      // Redirect to login page
      router.push("/api/auth/signin");
    }
  }, [session, status, router]);

  // Load comments and likes from database
  useEffect(() => {
    if (!blog || !session) return;
    
    loadBlogData();
  }, [blog, session]);

  const loadBlogData = async () => {
    try {
      // Load comments
      const commentsRes = await fetch(`/api/comments?blogId=${blog?.id}`);
      const commentsData = await commentsRes.json();
      setComments(commentsData.comments || []);

      // Load likes
      const likesRes = await fetch(`/api/likes?blogId=${blog?.id}`);
      const likesData = await likesRes.json();
      setLikes(likesData.likeCount || 0);
      setIsLiked(likesData.hasLiked || false);
    } catch (error) {
      console.error("Failed to load blog data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (status === "loading" || !session) {
    return (
      <Container className="py-32">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="py-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you are looking for does not exist.</p>
          <Link href="/blogs">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Back to Blogs
            </button>
          </Link>
        </div>
      </Container>
    );
  }

  const handleLike = async () => {
    if (isLiking) return;

    // Optimistic update
    const prevLiked = isLiked;
    const prevLikes = likes;
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiking(true);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: blog.id.toString() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to like");
      }

      // Update with server response
      setIsLiked(data.hasLiked);
      setLikes(data.likeCount);
    } catch (error: any) {
      // Revert on error
      setIsLiked(prevLiked);
      setLikes(prevLikes);
      alert(error.message || "Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = (newComment: any) => {
    // Add new comment to the list
    setComments([newComment, ...comments]);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Container className="py-20 lg:py-32">
      {/* Back Button */}
      <Link href="/blogs">
        <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-8 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Blogs</span>
        </button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          {/* Category & Featured Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(blog.postedDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image 
              src={blog.image} 
              alt={blog.title} 
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Tag className="w-4 h-4 text-gray-500" />
              {blog.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>
          </article>

          {/* Author Bio */}
          {blog.authorBio && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                {blog.authorAvatar ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src={blog.authorAvatar} 
                      alt={blog.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {blog.author[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">About {blog.author}</h3>
                  <p className="text-gray-600 text-sm">{blog.authorBio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 ${
                isLiked 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {isLiking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
              )}
              <span>{likes} Likes</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>

            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{comments.length} Comments</span>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection 
            blogId={blog.id.toString()}
            comments={comments} 
            onAddComment={handleComment}
            isLoggedIn={true} // User is always logged in on this page
            currentUser={{
              name: session.user?.name || "Anonymous",
              avatar: session.user?.image || "Noob"
            }}
          />
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24">
            <SuggestedPosts currentId={blog.id} blogs={blogs} />
          </div>
        </motion.aside>
      </div>
    </Container>
  );
};

export default BlogPage;