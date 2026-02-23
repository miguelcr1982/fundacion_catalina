import "server-only";

import { notFound } from "next/navigation";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";

export async function getCourseSidebarData(slug: string) {
  // Primero obtener el curso básico para verificar si es público
  const courseBasic = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, isPublic: true },
  });

  if (!courseBasic) {
    return notFound();
  }

  // Si el curso es público, permitir acceso sin autenticación
  if (courseBasic.isPublic) {
    const publicCourse = await prisma.course.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        fileKey: true,
        duration: true,
        level: true,
        isPublic: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        slug: true,
        chapter: {
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              select: {
                id: true,
                title: true,
                position: true,
                description: true,
                lessonProgress: {
                  select: {
                    completed: true,
                    lessonId: true,
                    id: true,
                  },
                },
              },
              orderBy: {
                position: "asc",
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return publicCourse;
  }

  // Si no es público, requiere autenticación
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      level: true,
      isPublic: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      slug: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: user.id,
                },
                select: {
                  completed: true,
                  lessonId: true,
                  id: true,
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }

  return course;
}

export type CourseSidebarData = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
