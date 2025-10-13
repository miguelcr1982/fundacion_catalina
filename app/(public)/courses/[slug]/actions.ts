"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { toast } from "sonner";

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

  if (existing?.status === "Active") {
    redirect(`/courses/${course.slug}`);
  }

  if (existing) {
    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { status: "Active", updatedAt: new Date() },
    });

    toast.success("Se ha actualizado su inscripción en el curso");
  } else {
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: "Active",
      },
    });

    toast.success("Se ha registrado con éxito en el curso");
  }

  redirect(`/courses/${course.slug}`);
}
