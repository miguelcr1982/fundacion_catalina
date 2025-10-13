import { IconBook, IconPlaylistX, IconUsers } from "@tabler/icons-react";

import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function SectionCards() {
  const { totalCourses, totalCustomers, totalSignups, totalLessons } =
    await adminGetDashboardStats();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Usuarios</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalSignups}
            </CardTitle>
          </div>
          <IconUsers className="text-muted-foreground size-6" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Usuarios registrados en la plataforma
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Cursos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCourses}
            </CardTitle>
          </div>
          <IconBook className="text-muted-foreground size-6" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Cursos disponibles en la plataforma
          </p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Lecciones</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalLessons}
            </CardTitle>
          </div>
          <IconPlaylistX className="text-muted-foreground size-6" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Contenido de aprendizaje total disponible
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
