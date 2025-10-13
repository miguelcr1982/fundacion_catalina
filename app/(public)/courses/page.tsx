import { getAllCourses } from "@/app/data/course/get-all-courses";
import { Suspense } from "react";

import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/public-course-card";

const PublicCoursesPage = () => {
  return (
    <div className="mt-5">
      <div className="mb-10 flex flex-col gap-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Explorar cursos
        </h1>
        <p className="text-muted-foreground">
          Descubre nuestra amplia gama de cursos diseñados para ayudarte a
          alcanzar tus objetivos.
        </p>
      </div>

      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
};

async function RenderCourses() {
  const courses = await getAllCourses();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default PublicCoursesPage;
