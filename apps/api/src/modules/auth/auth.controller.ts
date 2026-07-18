import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const user = await authService.register(input);
      res.status(201).json({ message: "Account created successfully", user });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input, {
        ip: req.ip ?? "unknown",
        userAgent: req.headers["user-agent"],
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken: result.accessToken, user: result.user });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) return res.status(401).json({ message: "No refresh token provided" });

      const result = await authService.refresh(token);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (token) await authService.logout(token);
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  },
};
