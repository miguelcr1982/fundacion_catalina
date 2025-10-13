import "server-only";

import { prisma } from "@/lib/db";

import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      fileKey: true,
      slug: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type AdminGetCourses = Awaited<
  ReturnType<typeof adminGetCourses>
>[number];
