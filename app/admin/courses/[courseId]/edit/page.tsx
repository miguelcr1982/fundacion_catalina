import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CourseStructure } from "./_components/course-structure";
import { EditCourseForm } from "./_components/edit-course-form";

interface CourseIdEditPageProps {
  params: Promise<{ courseId: string }>;
}

const CourseIdEditPage = async ({ params }: CourseIdEditPageProps) => {
  const { courseId } = await params;
  const data = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Editar curso:{" "}
        <span className="text-primary underline">{data.title}</span>
      </h1>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Detalle</TabsTrigger>
          <TabsTrigger value="course-structure">Capítulos</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
              <CardDescription>Detalle básico del curso</CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Capítulos</CardTitle>
              <CardDescription>
                Aquí puedes actualizar la estructura de tu curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseIdEditPage;
