import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import { blogSchemaWithoutImage } from "@/lib/validation/formSchema";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting post:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

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

    // Extract token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const image = formData.get("image") as File | null;

    // Validate data
    const parsed = blogSchemaWithoutImage.safeParse({ title, content });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    let imagePath = post.image;
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, image.name);
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/${image.name}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        image: imagePath,
      },
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
