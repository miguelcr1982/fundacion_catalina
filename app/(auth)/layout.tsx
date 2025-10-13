import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import Logo from "@/public/logo.png";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </Link>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src={Logo} alt="NextLearn Logo" width={48} height={48} />
        </Link>

        {children}

        {/* <div className="text-muted-foreground text-center text-xs leading-snug tracking-wide text-balance">
          Al hacer clic en continuar, aceptas nuestros{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-2"
          >
            Términos de servicio
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </div> */}
      </div>
    </div>
  );
};

export default AuthLayout;
