import "server-only";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
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
      <div className="p-6">
        <p>Usuario no encontrado.</p>
        <Link href="/admin/users" className="text-primary hover:underline">
          Volver a usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Detalle de usuario</h1>
        <Link
          href="/admin/users"
          className="text-sm text-slate-500 hover:underline"
        >
          Volver
        </Link>
      </div>

      <div className="max-w-2xl rounded-md border bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500">Nombre</label>
            <div className="font-medium">{user.name}</div>
          </div>
          <div>
            <label className="text-sm text-slate-500">Usuario</label>
            <div className="font-medium">{user.username}</div>
          </div>
          <div>
            <label className="text-sm text-slate-500">Email</label>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <label className="text-sm text-slate-500">Rol</label>
            <div className="font-medium">{user.role || "user"}</div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm text-slate-500">Estado</h3>
          <div className="mt-2 flex items-center gap-4">
            <div>
              Baneado: <strong>{user.banned ? "Sí" : "No"}</strong>
            </div>
            {user.banned && <div>Razón: {user.banReason || "-"}</div>}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm text-slate-500">Acciones</h3>
          <div>
            {/* client-side actions (delete) */}
            {/* eslint-disable-next-line @next/next/no-server-import-in-page */}
            {/* we import the client component below */}
            <UserActions id={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
