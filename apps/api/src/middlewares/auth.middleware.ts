import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    hospitalId: string | null;
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, hospitalId: payload.hospitalId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid token" });
  }
}
