import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function main() {
  const admins = [
    { username: "miguel", email: "miguel@test.com", password: "Paradigm1" },
    { username: "wendy", email: "wendy@test.com", password: "Paradigm1" },
    { username: "pamela", email: "pamela@test.com", password: "Paradigm1" },
  ];

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
