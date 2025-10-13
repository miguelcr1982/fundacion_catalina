"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "Curso eliminado exitosamente.",
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: "No se pudo eliminar el curso.",
    };
  }
}
