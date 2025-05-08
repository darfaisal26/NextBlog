import { NextResponse } from "next/server";

export async function GET() {
  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
  );

  return NextResponse.json({ message: "Logged out" }, { headers });
}
