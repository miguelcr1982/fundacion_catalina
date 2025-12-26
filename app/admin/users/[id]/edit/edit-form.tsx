"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Data = {
  id: string;
  username: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
};

export default function EditUserForm({ initialData }: { initialData: Data }) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [role, setRole] = useState(initialData.role || "user");
  const [banned, setBanned] = useState(Boolean(initialData.banned));
  const [banReason, setBanReason] = useState(initialData.banReason || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, banned, banReason }),
      });
      if (!res.ok) throw new Error("Error actualizando usuario");
      toast.success("Usuario actualizado");
      router.push(`/admin/users/${initialData.id}`);
    } catch (err) {
      toast.error((err as Error).message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl rounded-md border bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="grid grid-cols-1 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-slate-500">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-500">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-500">Rol</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={banned}
            onChange={(e) => setBanned(e.target.checked)}
          />
          <span className="text-sm">Baneado</span>
        </label>

        {banned && (
          <label className="flex flex-col">
            <span className="text-sm text-slate-500">Razón del baneo</span>
            <input
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="input"
            />
          </label>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary rounded-md px-4 py-2 text-white"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
