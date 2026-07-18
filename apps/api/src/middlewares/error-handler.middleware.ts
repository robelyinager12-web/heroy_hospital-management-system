import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Something went wrong on our end" });
}
