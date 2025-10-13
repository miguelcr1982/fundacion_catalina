import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";

type FeatureProps = {
  title: string;
  description: string;
  icon: string;
};

const FEATURES: FeatureProps[] = [
  {
    title: "Videos educativos",
    description:
      "Acceda a videos informativos sobre lactancia materna, nutrición y cuidado infantil, creados por profesionales de la salud.",
    icon: "🎥",
  },
  {
    title: "Aprendizaje práctico",
    description:
      "Aprenda a través de contenidos claros, demostraciones y consejos aplicables al cuidado diario de madres y bebés.",
    icon: "🍼",
  },
  {
    title: "Seguimiento y actualización",
    description:
      "Manténgase al día con nuevos materiales y recursos recomendados por la Fundación.",
    icon: "🔔",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {env.TITLE_GLOBAL}
          </h1>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            {env.DESCRIPCION_GLOBAL}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explora videos
            </Link>

            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Ingresar
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Card key={index} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
