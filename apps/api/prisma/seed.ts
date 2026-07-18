import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@heroy.com" },
    update: {},
    create: {
      email: "admin@heroy.com",
      firstName: "System",
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
