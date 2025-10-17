import { Comment } from "@/app/types/blog";
import React, { useState } from "react";


interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (message: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [commentInput, setCommentInput] = useState("");

  const handleAdd = () => {
    if (!commentInput) return;
    onAddComment(commentInput);
    setCommentInput("");
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="mb-4">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border rounded-lg p-2"
        />
        <button onClick={handleAdd} className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Add Comment
        </button>
      </div>
      {comments.map((c, idx) => (
        <div key={idx} className="mb-3 p-3 border rounded-lg">
          <p className="font-semibold">{c.user} <span className="text-gray-400 text-sm">{c.date}</span></p>
          <p>{c.message}</p>
        </div>
      ))}
    </div>
  );
};
