import { PrismaClient } from "@/generated/prisma";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value  || req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const blogs = await prisma.post.findMany();

    console.log("Blogs:", blogs); 
    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json({ error: "INTERNAL sERVER ERROR" }, { status: 500 });
  }
}
