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
