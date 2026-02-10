import { z } from "zod";

import { CourseLevel, CourseStatus } from "@/lib/generated/prisma";

export const courseLevels = [
  CourseLevel.Principiante,
  CourseLevel.Intermedio,
  CourseLevel.Avanzado,
] as const;

export const courseStatus = [
  CourseStatus.Borrador,
  CourseStatus.Publicado,
  CourseStatus.Archivado,
] as const;

export const courseCategories = [
  "Lactancia Materna",
  "Nutrición Infantil",
  "Salud Materna",
  "Cuidado del Recién Nacido",
  "Banco de Leche Humana",
  "Educación y Comunidad",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres" })
    .max(100, { message: "El título no puede tener más de 100 caracteres" }),
  description: z
    .string()
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  duration: z.coerce
    .number()
    .min(1, { message: "La duración debe ser al menos de 1 hora" })
    .max(10, { message: "La duración no puede exceder 10 horas" }),
  level: z.enum(courseLevels, { message: "Nivel es requerido" }),
  categoryId: z.string().min(1, { message: "Categoría es requerida" }),
  smallDescription: z
    .string()
    .min(3, { message: "El resumen debe tener al menos 3 caracteres" })
    .max(200, { message: "El resumen no puede tener más de 200 caracteres" }),
  slug: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  status: z.enum(courseStatus, { message: "Debe indicar un estado" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  courseId: z.string().uuid({ message: "ID de video inválido" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  courseId: z.string().uuid({ message: "ID de video inválido" }),
  chapterId: z.string().uuid({ message: "ID de capítulo inválido" }),
  description: z
    .string()
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
