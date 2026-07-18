import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "admin@heroy.com" } });
  if (!user) {
    console.log("No user found with that email");
    return;
  }
  const match = await bcrypt.compare("Admin@123", user.passwordHash);
  console.log("Password matches:", match);
}

main().finally(() => prisma.$disconnect());
