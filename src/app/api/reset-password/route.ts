import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, email } = body;
  const hashedPassword = await hash(password, 10);
  try {
    const updateUser = await db.user.update({
      where: { email: email },
      data: {
        password: hashedPassword,
      },
    });
    if (!updateUser) {
      return NextResponse.json({
        status: 404,
        json: { message: "User not found" },
      });
    }
    return NextResponse.json({
      status: 200,
      json: { message: "Password updated" },
    });
  } catch {
    return NextResponse.json({
      status: 500,
      json: { message: "Server error" },
    });
  }
}
