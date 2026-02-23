import "server-only";

import { notFound } from "next/navigation";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";

export async function getLessonContent(lessonId: string) {
  // Obtener la lección básica para verificar el curso
  const lessonBasic = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              isPublic: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lessonBasic) {
    return notFound();
  }

  // Si el curso es público, permitir acceso sin autenticación
  if (lessonBasic.chapter.course.isPublic) {
    const publicLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailKey: true,
        videoKey: true,
        position: true,
        lessonProgress: {
          select: {
            completed: true,
            lessonId: true,
          },
        },
        chapter: {
          select: {
            courseId: true,
            course: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    return publicLesson;
  }

  // Si no es público, requiere autenticación
  const session = await requireUser();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      lessonProgress: {
        where: {
          userId: session.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: lesson.chapter.courseId,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }

  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
