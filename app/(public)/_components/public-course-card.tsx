import { SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { GetAllCourses } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface PublicCourseCardProps {
  data: GetAllCourses[number];
}

export const PublicCourseCard = ({ data }: PublicCourseCardProps) => {
  const thumbnailUrl = useConstructUrl(data.fileKey);

  return (
    <Card className="group relative gap-0 py-0">
      <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>

      <Image
        src={thumbnailUrl}
        width={600}
        height={400}
        alt="thumbnail image"
        className="aspect-video size-full rounded-t-xl object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
        >
          {data.title}
        </Link>

        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <SchoolIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{data.category}</p>
          </div>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({ className: "mt-4 w-full" })}
        >
          Más información
        </Link>
      </CardContent>
    </Card>
  );
};

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 py-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="relative h-fit w-full">
        <Skeleton className="aspect-video w-full rounded-t-xl" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>

          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
