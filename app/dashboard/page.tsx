import { PublicCourseCard } from "@/app/(public)/_components/public-course-card";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { getEnrolledCourses } from "@/app/data/user/get-enrolled-courses";
import { EmptyState } from "@/components/general/empty-state";
import Link from "next/link";

const DashboardPage = async () => {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  const coursesNotEnrolled = courses.filter(
    (course) =>
      !enrolledCourses.some(
        ({ Course: enrolled }) => enrolled.id === course.id,
      ),
  );

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Cursos matriculados</h1>
        <p className="text-muted-foreground">
          Aquí podrás ver todos los cursos a los que tienes acceso.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No hay cursos matriculados"
          description="Aún no te has matriculado en ningún curso."
          buttonText="Explorar cursos"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enrolledCourses.map((course) => (
            <Link
              key={course.Course.id}
              href={`/dashboard/${course.Course.slug}`}
            >
              {course.Course.title}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Cursos disponibles</h1>
          <p className="text-muted-foreground">
            Aquí podrás ver todos los cursos que puedes matricular.
          </p>
        </div>

        {coursesNotEnrolled.length === 0 ? (
          <EmptyState
            title="No hay cursos disponibles"
            description="No hay cursos disponibles en este momento."
            buttonText="Explorar cursos"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {coursesNotEnrolled.map((course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default DashboardPage;
