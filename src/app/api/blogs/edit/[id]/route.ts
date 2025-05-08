import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    // const userId = decoded.userId;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    console.error("Error editing post:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: "Failed to edit post" }, { status: 500 });
  }
}
