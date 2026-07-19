import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Heroy2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "superadmin@heroy.com" },
    update: { passwordHash },
    create: {
      email: "superadmin@heroy.com",
      firstName: "Robel",
      lastName: "Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Seeded admin user:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
