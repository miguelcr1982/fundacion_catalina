import Link from "next/link";
import { Suspense } from "react";

import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "@/app/admin/courses/_components/admin-course-card";
import { adminGetEnrollmentStats } from "@/app/data/admin/admin-get-enrollment-stats";
import { adminGetRecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/empty-state";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";

const AdminPage = async () => {
  const enrollmentData = await adminGetEnrollmentStats();

  return (
    <>
      <SectionCards />

      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cursos recientes</h2>
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            Ver todos los cursos
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
};

export default AdminPage;

const RenderRecentCourses = async () => {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Crear un nuevo curso"
        description="Aún no tienes cursos. Haz clic en el botón de abajo para crear uno nuevo."
        title="No se encontraron cursos"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
};

const RenderRecentCoursesSkeletonLayout = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};
