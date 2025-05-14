import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value ||
    req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogs = await prisma.post.findMany();
    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json(
      { error: "INTERNAL sERVER ERROR" },
      { status: 500 }
    );
  }
}
