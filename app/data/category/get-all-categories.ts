import "server-only";

import { prisma } from "@/lib/db";

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export type AllCategories = Awaited<ReturnType<typeof getAllCategories>>;
