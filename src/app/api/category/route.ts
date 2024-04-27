import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body;

  const categoryExists = await db.category.findUnique({
    where: { name },
  });

  if (categoryExists) {
    return NextResponse.json({
      message: "Category already exists",
      status: 409,
    });
  }
  try {
    const newCategory = await db.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json({
      category: newCategory,
      status: 201,
    });
  } catch {
    return NextResponse.json({
      message: "Something wrong when creating category",
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const categories = await db.category.findMany();
    return NextResponse.json({
      categories: categories,
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
  const categoryHasNotes = await db.category
    .findUnique({
      where: {
        id: Number(id),
      },
      include: { notes: true },
    })
    .then((category) => category && category.notes.length > 0);
  if (categoryHasNotes) {
    return NextResponse.json({
      message: "Category has notes, please delete notes first",
      status: 400,
    });
  }
  try {
    await db.category.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({
      message: "Category deleted successfully",
      status: 200,
    });
  } catch {
    return NextResponse.json({
      message: "Something wrong when deleting category",
      status: 500,
    });
  }
}
