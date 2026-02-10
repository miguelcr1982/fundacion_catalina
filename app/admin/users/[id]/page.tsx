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
import { UserActions } from "./user-actions";

type Props = { params: any };

export default async function UserDetailPage({ params }: Props) {
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
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return (
      <div className="space-y-4 p-6">
        <p>Usuario no encontrado.</p>
        <Link href="/admin/users" className="text-primary hover:underline">
          Volver a usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Detalle de usuario</h1>
          <p className="text-muted-foreground text-sm">
            Informacion general y acciones disponibles.
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Datos del usuario</CardTitle>
          <CardDescription>
            Revisa los datos base y el estado actual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border p-4">
              <label className="text-muted-foreground text-sm">Nombre</label>
              <div className="mt-2 font-medium">{user.name}</div>
            </div>
            <div className="rounded-md border p-4">
              <label className="text-muted-foreground text-sm">Usuario</label>
              <div className="mt-2 font-medium">{user.username}</div>
            </div>
            <div className="rounded-md border p-4">
              <label className="text-muted-foreground text-sm">Email</label>
              <div className="mt-2 font-medium">{user.email}</div>
            </div>
            <div className="rounded-md border p-4">
              <label className="text-muted-foreground text-sm">Rol</label>
              <div className="mt-2 font-medium">{user.role || "user"}</div>
            </div>
            <div className="rounded-md border p-4">
              <h3 className="text-muted-foreground text-sm">Estado</h3>
              <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
                <div>
                  Baneado: <strong>{user.banned ? "Sí" : "No"}</strong>
                </div>
                {user.banned && <div>Razón: {user.banReason || "-"}</div>}
              </div>
            </div>
            <div className="rounded-md border p-4">
              <h3 className="text-muted-foreground text-sm">Acciones</h3>
              <div className="mt-3">
                {/* client-side actions (delete) */}
                {/* eslint-disable-next-line @next/next/no-server-import-in-page */}
                {/* we import the client component below */}
                <UserActions id={user.id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
