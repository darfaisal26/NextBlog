import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { blogSchema } from "@/lib/validation/formSchema";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

export async function POST(req: NextRequest) {
  try {
    const tokenHeader = req.headers.get("authorization") || "";
    const token = tokenHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const image = formData.get("image");

    // Run Zod validation
    const parsed = blogSchema.safeParse({ title, content, image });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // Handle file upload
    const file = image as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, file.name);
    await fs.writeFile(filePath, buffer);
    const imagePath = `/uploads/${file.name}`;

    // Save to DB
    const newPost = await prisma.post.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        authorId: userId,
        image: imagePath,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
