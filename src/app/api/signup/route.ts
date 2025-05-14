import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { FormSchema } from "@/lib/validation/formSchema";
import bcrypt from "bcryptjs"; 




const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = FormSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
