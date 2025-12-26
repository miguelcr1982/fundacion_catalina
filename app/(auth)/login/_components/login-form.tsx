"use client";

import { Loader2Icon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const [startSignInTransition] = useTransition();
  const [emailSignInPending, startEmailSignInTransition] = useTransition();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // async function ensureAdmin() {
  //   const name = "miguel";
  //   const password = "Paradigm1";
  //   const email = "test@test.com";
  //   const username = "miguel";
  //   const displayUsername = "miguel";

  //   const { data, error } = await authClient.signUp.email({
  //     email,
  //     name,
  //     password,
  //     username,
  //     displayUsername,
  //   });

  //   if (error) {
  //     console.error("Error creando admin:", error);
  //   } else {
  //     console.log("Usuario admin creado:", data?.user.email);
  //   }
  // }

  function signInWithEmail() {
    // ensureAdmin();
    startEmailSignInTransition(async () => {
      await authClient.signIn.username({
        username: user,
        password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Inicio de sesión exitoso");
            router.push("/admin");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Bienvenido de vuelta</CardTitle>
        <CardDescription>Ingresa</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="usuario">Usuario</Label>
            <Input
              type="text"
              id="usuario"
              placeholder=""
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!emailSignInPending && user) {
                    signInWithEmail();
                  }
                }
              }}
              required
            />
          </div>

          <Button
            onClick={signInWithEmail}
            disabled={emailSignInPending || !user}
          >
            {emailSignInPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <SendIcon className="size-4" />
                <span>Continuar</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
