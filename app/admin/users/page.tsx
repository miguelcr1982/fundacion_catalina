import "server-only";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        {/* <Link href="/admin/users/new" className="btn btn-primary">
          Nuevo usuario
        </Link> */}
      </div>

      <div className="overflow-x-auto rounded-md border bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full table-auto">
          <thead className="bg-slate-50 text-sm text-slate-500 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Baneado</th>
              <th className="px-4 py-3 text-left">Creado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role || "user"}</td>
                <td className="px-4 py-3">{u.banned ? "Sí" : "No"}</td>
                <td className="px-4 py-3">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="text-primary hover:underline"
                  >
                    Ver / Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
