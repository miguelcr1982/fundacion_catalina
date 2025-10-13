"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Cerró sesión correctamente");
          router.push("/login");
        },
        onError: () => {
          toast.error("No se pudo cerrar sesión");
        },
      },
    });
  };

  return handleSignOut;
}
