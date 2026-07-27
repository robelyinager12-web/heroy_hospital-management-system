import { authRepository } from "./auth.repository";
import { hashPassword, comparePassword } from "../../utils/password.util";
import { signAccessToken, generateRefreshToken, hashRefreshToken } from "../../utils/jwt.util";
import { AppError } from "../../middlewares/error-handler.middleware";
import { RegisterInput, LoginInput } from "./auth.validation";

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "An account with this email already exists");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    return { id: user.id, email: user.email, role: user.role };
  },

  async login(input: LoginInput, meta: { ip: string; userAgent?: string }) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const validPassword = await comparePassword(input.password, user.passwordHash);
    if (!validPassword) {
      throw new AppError(401, "Invalid email or password");
    }

    if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
      throw new AppError(403, "This account is no longer active");
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role, hospitalId: user.hospitalId });
    const { token: refreshToken, hash } = generateRefreshToken();

    await authRepository.storeRefreshToken({
      userId: user.id,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userAgent: meta.userAgent,
      ipAddress: meta.ip,
    });

    await authRepository.updateLastLogin(user.id, meta.ip);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role },
    };
  },

  async refresh(refreshToken: string) {
    const hash = hashRefreshToken(refreshToken);
    const stored = await authRepository.findRefreshToken(hash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AppError(401, "Session expired, please log in again");
    }

    const user = await authRepository.findById(stored.userId);
    if (!user) {
      throw new AppError(401, "User not found");
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role, hospitalId: user.hospitalId });
    return { accessToken };
  },

  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found");
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  },

  async updateProfile(userId: string, input: { firstName?: string; lastName?: string; phone?: string }) {
    await this.getProfile(userId);
    const updated = await authRepository.updateProfile(userId, input);
    return { id: updated.id, firstName: updated.firstName, lastName: updated.lastName, phone: updated.phone };
  },

  async changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found");

    const isValid = await comparePassword(input.currentPassword, user.passwordHash);
    if (!isValid) throw new AppError(400, "Current password is incorrect");

    const newHash = await hashPassword(input.newPassword);
    await authRepository.updatePassword(userId, newHash);
  },

  async logout(refreshToken: string) {
    const hash = hashRefreshToken(refreshToken);
    await authRepository.revokeRefreshToken(hash).catch(() => null);
  },
};
