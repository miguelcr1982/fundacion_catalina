import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { getCourse } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import { RenderDescription } from "@/components/rich-text-editor/render-description";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { EnrollmentButton } from "./_components/enrollment-button";

interface CourseSlugPageProps {
  params: Promise<{ slug: string }>;
}

const CourseSlugPage = async ({ params }: CourseSlugPageProps) => {
  const { slug } = await params;

  const course = await getCourse(slug);
  const isEnrolled = await checkIfCourseBought(course.id);

  const thumbnailUrl = course.fileKey;

  return (
    <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={thumbnailUrl}
            alt={course.title}
            className="object-cover"
            fill
            priority
          />

          <div className="from-background/20 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-muted-foreground line-clamp-2 text-lg leading-relaxed">
              {course.smallDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge>
              <IconCategory className="size-4" />
              <span>{course.category.name}</span>
            </Badge>
            <Badge>
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Descripción del curso
            </h2>

            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Contenido del curso
            </h2>
            <div>
              {course.chapter.length} capítulos |{" "}
              {course.chapter.reduce(
                (total, chapter) => total + chapter.lessons.length,
                0,
              ) || 0}{" "}
              lecciones
            </div>
          </div>

          <div className="space-y-4">
            {course.chapter.map((chapter, index) => (
              <Collapsible key={chapter.id} defaultOpen={index === 0}>
                <Card className="gap-0 overflow-hidden border-2 p-0 transition-all duration-200 hover:shadow-md">
                  <CollapsibleTrigger>
                    <div>
                      <CardContent className="hover:bg-muted/50 p-6 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full font-semibold">
                              {index + 1}
                            </p>
                            <div>
                              <h3 className="text-left text-xl font-semibold">
                                {chapter.title}
                              </h3>
                              <p className="text-muted-foreground mt-1 text-left text-sm">
                                {chapter.lessons.length}{" "}
                                {chapter.lessons.length !== 1
                                  ? "Lecciones"
                                  : "Lección"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {chapter.lessons.length}{" "}
                              {chapter.lessons.length !== 1
                                ? "Lecciones"
                                : "Lección"}
                            </Badge>
                            <IconChevronDown className="text-muted-foreground size-5" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-muted/20 border-t">
                      <div className="space-y-3 p-6 pt-4">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="hover:bg-accent group flex items-center gap-4 rounded-lg p-3 transition-colors"
                          >
                            <div className="bg-background border-primary/20 flex size-8 items-center justify-center rounded-full border-2">
                              <IconPlayerPlay className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {lesson.title}
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                Lección {lessonIndex + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* enrollment card */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="bg-muted mb-6 space-y-3 rounded-lg p-4">
                <h4 className="font-medium">Información del curso:</h4>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duración</p>
                      <p className="text-muted-foreground text-sm">
                        {course.duration} horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nivel</p>
                      <p className="text-muted-foreground text-sm">
                        {course.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <IconCategory className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Categoría</p>
                      <p className="text-muted-foreground text-sm">
                        {course.category.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Lecciones</p>
                      <p className="text-muted-foreground text-sm">
                        {course.chapter.reduce(
                          (total, chapter) => total + chapter.lessons.length,
                          0,
                        ) || 0}{" "}
                        Lecciones
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isEnrolled ? (
                <Link
                  href="/dashboard"
                  className={buttonVariants({ className: "w-full" })}
                >
                  Ver curso
                </Link>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseSlugPage;
