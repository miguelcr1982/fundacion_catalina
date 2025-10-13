import { ArrowLeftIcon, ShieldXIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NotAdminPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto w-fit rounded-full p-4">
            <ShieldXIcon className="text-destructive size-16" />
          </div>

          <CardTitle className="text-2xl">Access Restricted</CardTitle>
          <CardDescription>
            No tienes permiso para crear contenido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants({ className: "w-full" })}>
            <ArrowLeftIcon className="mr-1 size-4" />
            Volver a Inicio
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAdminPage;
