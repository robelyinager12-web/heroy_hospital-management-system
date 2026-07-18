import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwtConfig } from "../config/jwt.config";

export interface AccessTokenPayload {
  sub: string;
  role: string;
  hospitalId: string | null;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
    issuer: jwtConfig.issuer,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, jwtConfig.accessSecret, {
    issuer: jwtConfig.issuer,
  }) as AccessTokenPayload;
}

export function generateRefreshToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(64).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
