"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async function signOut() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Cerró sesión correctamente");
            router.push("/");
          },
          onError: () => {
            throw new Error("signout-failed");
          },
        },
      });
    } catch (err) {
      // fallback: clear session cookies server-side and redirect
      try {
        await fetch("/api/auth/clear-session", { method: "POST" });
      } catch (e) {
        // ignore
      }
      toast.success("Sesión cerrada");
      router.push("/");
    }
  };

  return handleSignOut;
}
