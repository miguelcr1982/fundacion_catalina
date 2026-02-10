"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
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

  async function handlePasswordChange() {
    if (!newPassword.trim()) {
      toast.error("La contrasena es requerida");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contrasenas no coinciden");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/admin/set-user-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: initialData.id,
          newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Error actualizando contrasena");
      }

      toast.success("Contrasena actualizada");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error((err as Error).message || "Error");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="user-name">Nombre</Label>
          <Input
            id="user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-email">Email</Label>
          <Input
            id="user-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-role">Rol</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="user-role">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">user</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="user-banned"
            checked={banned}
            onCheckedChange={(value) => setBanned(Boolean(value))}
          />
          <Label htmlFor="user-banned">Baneado</Label>
        </div>

        {banned && (
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label htmlFor="ban-reason">Razon del baneo</Label>
            <Input
              id="ban-reason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Cambiar contrasena</h3>
          <p className="text-muted-foreground text-xs">
            Reemplaza la contrasena del usuario con una nueva.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contrasena</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar contrasena</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handlePasswordChange}
            disabled={passwordLoading}
          >
            {passwordLoading ? "Actualizando..." : "Actualizar contrasena"}
          </Button>
        </div>
      </div>
    </form>
  );
}
