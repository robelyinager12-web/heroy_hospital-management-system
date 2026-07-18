import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have permission to perform this action" });
    }

    next();
  };
}
