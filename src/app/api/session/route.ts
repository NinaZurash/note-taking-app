import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { university, date, userId, id } = body;

    const newSession = await db.sessions.create({
      data: {
        id,
        university,
        date,
        userId,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");

  if (!userId) throw new Error("User ID is required");
  else {
    const sessions = await db.sessions.findMany({
      where: { userId: parseInt(userId) },
    });
    return NextResponse.json(sessions);
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { university, date, id } = body;

    const session = await db.sessions.update({
      where: { id },
      data: {
        university,
        date,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Session updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
