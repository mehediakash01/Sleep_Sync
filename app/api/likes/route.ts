// app/api/likes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { PrismaClient } from "@/app/generated/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET - Get like count and user's like status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");
    const session = await getServerSession(authOptions);

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Count total likes for this blog
    const likeCount = await prisma.like.count({
      where: { blogId },
    });

    // Check if current user has liked
    let hasLiked = false;
    if (session?.user?.email) {
      const existingLike = await prisma.like.findUnique({
        where: {
          blogId_userId: {
            blogId,
            userId: session.user.email,
          },
        },
      });
      hasLiked = !!existingLike;
    }

    return NextResponse.json({
      likeCount,
      hasLiked,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

// POST - Toggle like (like/unlike)
export async function POST(req: NextRequest) {
  try {
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to like" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { blogId } = body;

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.email;

    // Check if user already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });

    let hasLiked: boolean;

    if (existingLike) {
      // Unlike - delete the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      hasLiked = false;
    } else {
      // Like - create new like
      await prisma.like.create({
        data: {
          blogId,
          userId,
        },
      });
      hasLiked = true;
    }

    // Count total likes
    const likeCount = await prisma.like.count({
      where: { blogId },
    });

    return NextResponse.json({
      success: true,
      hasLiked,
      likeCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}