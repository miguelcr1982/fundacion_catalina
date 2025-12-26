import "server-only";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Editar usuario</h1>
      <EditUserForm initialData={user} />
    </div>
  );
}
