"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
};

export function UserActions({ id }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Eliminar este usuario? Esta acción es irreversible."))
      return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      toast.success("Usuario eliminado");
      router.push("/admin/users");
    } catch (err) {
      toast.error((err as Error).message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 flex gap-3">
      <a
        href={`/admin/users/${id}/edit`}
        className="bg-primary rounded-md px-3 py-2 text-white"
      >
        Editar
      </a>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-md bg-red-600 px-3 py-2 text-white"
      >
        {loading ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
}
