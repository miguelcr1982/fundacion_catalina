import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  await requireAdmin();

  const id = params.id;
  const body = await req.json();

  const { name, email, role, banned, banReason } = body;

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
      banned,
      banReason,
    },
  });

  return NextResponse.json({ ok: true, user: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  await requireAdmin();

  const id = params.id;

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
