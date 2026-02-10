import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const withCount = url.searchParams.get("withCount") === "true";

    if (withCount) {
      const categories = await prisma.category.findMany({
        include: {
          courses: {
            select: { id: true },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      const categoriesWithCount = categories.map((category) => ({
        ...category,
        courseCount: category.courses.length,
        courses: undefined,
      }));

      return NextResponse.json(categoriesWithCount);
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    return NextResponse.json(
      { error: "Error al cargar las categorías" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una categoría con este nombre" },
        { status: 409 },
      );
    }
    console.error("Error al crear la categoría:", error);
    return NextResponse.json(
      { error: "Error al crear la categoría" },
      { status: 500 },
    );
  }
}
