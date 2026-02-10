import "server-only";

import { prisma } from "@/lib/db";

export async function getAllCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "Publicado",
    },
    select: {
      title: true,
      smallDescription: true,
      fileKey: true,
      id: true,
      slug: true,
      level: true,
      duration: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type GetAllCourses = Awaited<ReturnType<typeof getAllCourses>>;
