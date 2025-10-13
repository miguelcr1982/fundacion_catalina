"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";

export async function enrollInCourseAction(courseId: string) {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, slug: true },
  });

  if (!course) {
    throw new Error("Curso no encontrado");
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: user.id, courseId: course.id },
    },
  });

  let message = "";

  if (existing?.status === "Active") {
    message = "Ya estás inscrito en este curso";
    //redirect(`/courses/${course.slug}`);
  }

  if (existing) {
    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { status: "Active", updatedAt: new Date() },
    });

    message = "Se ha actualizado su inscripción en el curso";
  } else {
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: "Active",
      },
    });

    message = "Se ha registrado con éxito en el curso";
  }

  return { message, slug: course.slug };

  //redirect(`/courses/${course.slug}`);
}
