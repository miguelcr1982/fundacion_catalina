import "server-only";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import EditUserForm from "./edit-form";

type Props = { params: any };

export default async function EditUserPage({ params }: Props) {
  await requireAdmin();
  const { id } = (await params) as { id: string };

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      banReason: true,
    },
  });

  if (!user) return <div className="p-6">Usuario no encontrado</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/users/${user.id}`}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar usuario</h1>
          <p className="text-muted-foreground text-sm">
            Actualiza datos, rol, estado y contrasena del usuario.
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informacion del usuario</CardTitle>
          <CardDescription>
            Mantiene al dia los datos de acceso y perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm initialData={user} />
        </CardContent>
      </Card>
    </div>
  );
}
