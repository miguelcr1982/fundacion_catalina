"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schemas";

export async function CreateCourse(
  data: CourseSchemaType,
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Formulario inválido",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Curso creado exitosamente",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Error al crear el curso",
    };
  }
}
