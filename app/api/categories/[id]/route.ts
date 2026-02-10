import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una categoría con este nombre" },
        { status: 409 },
      );
    }
    console.error("Error al actualizar la categoría:", error);
    return NextResponse.json(
      { error: "Error al actualizar la categoría" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Categoría eliminada exitosamente" });
  } catch (error: any) {
    if (error.code === "P2014" || error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar una categoría que tiene cursos asociados",
        },
        { status: 409 },
      );
    }
    if (error.message?.includes("Foreign key constraint failed")) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar una categoría que tiene cursos asociados",
        },
        { status: 409 },
      );
    }
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error al eliminar la categoría" },
      { status: 500 },
    );
  }
}
