import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import prisma from "@/prisma/prismaClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 3️⃣ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Save user to DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 5️⃣ Return success response
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
