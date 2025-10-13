"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zod-schemas";
import { revalidatePath } from "next/cache";

export async function EditCourse(
  data: CourseSchemaType,
  courseId: string,
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Datos no válidos",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: data,
    });

    return {
      status: "success",
      message: "Curso actualizado exitosamente",
    };
  } catch (error) {
    return {
      status: "error",
      message: "No se pudo actualizar el curso",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No hay lecciones disponibles para reordenar",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId,
        },
        data: {
          position: lesson.position,
        },
      }),
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lecciones reordenadas exitosamente",
    };
  } catch (error) {
    return {
      status: "error",
      message: "No se pudieron reordenar las lecciones",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[],
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No hay capítulos disponibles para reordenar",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId,
        },
        data: {
          position: chapter.position,
        },
      }),
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Capítulos reordenados exitosamente",
    };
  } catch (error) {
    return {
      status: "error",
      message: "No se pudieron reordenar los capítulos",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Datos no válidos",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      const position = maxPos ? maxPos.position + 1 : 1;

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Capítulo creado con éxito",
    };
  } catch (error) {
    return {
      status: "error",
      message: "No se pudo crear el capítulo",
    };
  }
}

export async function createLesson(
  values: LessonSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Datos de lección no válidos",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      const position = maxPos ? maxPos.position + 1 : 1;

      await tx.lesson.create({
        data: {
          title: result.data.name,
          chapterId: result.data.chapterId,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          position,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lección creada exitosamente",
    };
  } catch (error) {
    return {
      status: "error",
      message: "No se pudo crear la lección",
    };
  }
}

export async function deleteLesson({
  chapterId,
  lessonId,
  courseId,
}: {
  courseId: string;
  chapterId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      include: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Capítulo no encontrado",
      };
    }

    const lessons = chapterWithLessons.lessons;

    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonToDelete) {
      return {
        status: "error",
        message: "Lesson not found",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lección eliminada exitosamente",
    };
  } catch (error) {
    return {
      status: "error",
      message: "No se pudo eliminar la lección",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  courseId: string;
  chapterId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapter: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Curso no encontrado",
      };
    }

    const chapters = courseWithChapters.chapter;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId,
    );

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Capítulo no encontrado",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId,
    );

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      // delete all lessons in the chapter
      prisma.lesson.deleteMany({
        where: {
          chapterId: chapterId,
        },
      }),
      // update positions
      ...updates,
      // delete the chapter
      prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Capítulo eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return {
      status: "error",
      message: "No se pudo eliminar el capítulo",
    };
  }
}
