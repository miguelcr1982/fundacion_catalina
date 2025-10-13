"use client";

import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { enrollInCourseAction } from "../actions";

interface EnrollmentButtonProps {
  courseId: string;
}

export const EnrollmentButton = ({ courseId }: EnrollmentButtonProps) => {
  const [pending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      await enrollInCourseAction(courseId);
    });
  };

  return (
    <Button className="w-full" onClick={onSubmit} disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          Cargando...
        </>
      ) : (
        "Inscríbete ahora"
      )}
    </Button>
  );
};
