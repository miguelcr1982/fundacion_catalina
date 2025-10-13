"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";

import { deleteCourse } from "./actions";

interface CourseIdDeletePageProps {}

const CourseIdDeletePage = ({}: CourseIdDeletePageProps) => {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("Se produjo un error inesperado. Inténtalo de nuevo.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);

        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>

          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            {pending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Borrar
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseIdDeletePage;
