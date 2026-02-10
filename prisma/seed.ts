import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const courseCategories = [
  "Lactancia Materna",
  "Nutrición Infantil",
  "Salud Materna",
  "Cuidado del Recién Nacido",
  "Banco de Leche Humana",
  "Educación y Comunidad",
];

async function main() {
  // Crear categorías
  console.log("Creando categorías...");
  for (const categoryName of courseCategories) {
    const existing = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (existing) {
      console.log("Categoría ya existe:", categoryName);
      continue;
    }

    await prisma.category.create({
      data: { name: categoryName },
    });

    console.log("Categoría creada:", categoryName);
  }

  // Crear admins
  const admins = [
    { username: "miguel", email: "miguel@test.com", password: "Paradigm1" },
    { username: "wendy", email: "wendy@test.com", password: "Paradigm1" },
    { username: "pamela", email: "pamela@test.com", password: "Paradigm1" },
  ];

  console.log("Creando usuarios admin...");
  for (const { username, email, password } of admins) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      console.log("Usuario admin ya existe:", username);
      continue;
    }

    const data = await auth.api.createUser({
      body: {
        email,
        name: username,
        password,
        role: "admin",
        data: { username },
      },
    });

    console.log("Usuario admin creado:", data);
  }
}

main()
  .then(() => {
    console.log("Seed completado");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
