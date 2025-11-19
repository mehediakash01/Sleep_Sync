"use client";

import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  userAvatar?: string;
  message: string;
  date: string;
  createdAt?: Date;
}

interface CommentSectionProps {
  blogId: string;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  isLoggedIn: boolean;
  currentUser?: {
    name: string;
    avatar?: string;
  };
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  blogId,
  comments,
  onAddComment,
  isLoggedIn,
  currentUser,
}) => {
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentInput.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (commentInput.length > 1000) {
      setError("Comment is too long (max 1000 characters)");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId,
          message: commentInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add comment");
      }

      // Add comment to the list
      onAddComment(data.comment);
      setCommentInput("");
    } catch (err: any) {
      setError(err.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
              rows={4}
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-400">
              {commentInput.length}/1000
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!commentInput.trim() || isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt={comment.user}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {comment.user.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {comment.user}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};