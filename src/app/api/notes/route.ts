import { db } from "@/lib/db";
import { Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, isPublic, categories, userId } = body;
  try {
    const newNote = await db.note.create({
      data: {
        title,
        description,
        isPublic,
        categories: {
          connect: categories.map((category: Category) => ({
            id: Number(category.id),
          })),
        },
        user: {
          connect: {
            id: Number(userId),
          },
        },
      },
      include: {
        categories: true,
        user: true,
      },
    });

    if (newNote) {
      return NextResponse.json({
        status: 201,
        message: "Note created successfully",
        note: newNote,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error,
    });
  }
}

export async function GET() {
  try {
    const notes = await db.note.findMany({
      include: {
        categories: true,
        user: true,
      },
    });
    return NextResponse.json({
      notes: notes,
      status: 200,
    });
  } catch {
    return NextResponse.json({
      message: "Something wrong when fetching categories",
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  const id = query.get("id");

  try {
    await db.note.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({
      message: "Note deleted successfully",
      status: 200,
    });
  } catch {
    return NextResponse.json({
      message: "Something wrong when deleting a not",
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, description, isPublic, categories } = body;
  try {
    const updatedNote = await db.note.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
        isPublic,
        categories: {
          connect: categories.map((category: Category) => ({
            id: Number(category.id),
          })),
        },
      },
      include: {
        categories: true,
        user: true,
      },
    });

    if (updatedNote) {
      return NextResponse.json({
        status: 200,
        message: "Note updated successfully",
        note: updatedNote,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error,
    });
  }
}
