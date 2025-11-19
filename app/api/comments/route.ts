// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { PrismaClient } from "@/app/generated/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET - Fetch all comments for a blog
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Fetch comments from database
    const comments = await prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Add a new comment
export async function POST(req: NextRequest) {
  try {
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { blogId, message } = body;

    // Validation
    if (!blogId || !message) {
      return NextResponse.json(
        { error: "Blog ID and message are required" },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Comment is too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Create comment in database
    const comment = await prisma.comment.create({
      data: {
        blogId,
        userId: session.user.email || "unknown", // Use email as userId
        user: session.user.name || "Anonymous",
        userAvatar: session.user.image || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        user: comment.user,
        userAvatar: comment.userAvatar,
        message: comment.message,
        date: comment.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}