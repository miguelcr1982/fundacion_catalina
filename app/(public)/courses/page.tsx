"use client";

import { GetAllCourses } from "@/app/data/course/get-all-courses";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/public-course-card";

type CoursesData = GetAllCourses[number];

interface Category {
  id: string;
  name: string;
}

const PublicCoursesPage = () => {
  const [courses, setCourses] = useState<CoursesData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCourses();
    fetchCategories();
  }, []);

  const filteredCourses =
    selectedCategory === "Todos"
      ? courses
      : courses.filter((course) => course.category.name === selectedCategory);

  // Paginación
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return (
    <div className="mt-5">
      <div className="mb-4 flex flex-col gap-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Explorar cursos
        </h1>
        <p className="text-muted-foreground">
          Descubre nuestra amplia gama de cursos diseñados para ayudarte a
          alcanzar tus objetivos.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Filtrar por categoría:
          </label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Cursos por página:
          </label>
          <Select
            value={String(itemsPerPage)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeletonLayout />
      ) : filteredCourses.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            No hay cursos disponibles en esta categoría.
          </p>
        </div>
      ) : (
        <>
          <div className="text-muted-foreground mb-4 text-sm">
            Mostrando {startIndex + 1} a{" "}
            {Math.min(endIndex, filteredCourses.length)} de{" "}
            {filteredCourses.length} cursos
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCourses.map((course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="mr-2 size-4" />
              Anterior
            </Button>

            <div className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRightIcon className="ml-2 size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

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
