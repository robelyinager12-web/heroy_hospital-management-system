import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  createUser: (data: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: any;
  }) => prisma.user.create({ data }),

  storeRefreshToken: (data: { userId: string; tokenHash: string; expiresAt: Date; userAgent?: string; ipAddress?: string }) =>
    prisma.refreshToken.create({ data }),

  findRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.findUnique({ where: { tokenHash } }),

  revokeRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.update({ where: { tokenHash }, data: { revokedAt: new Date() } }),

  updateLastLogin: (userId: string, ip: string) =>
    prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date(), lastLoginIp: ip } }),
};
