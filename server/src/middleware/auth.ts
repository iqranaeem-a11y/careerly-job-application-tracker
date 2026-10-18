import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = (
  request: Request,
  _response: Response,
  next: NextFunction
): void => {
  const authorization = request.header("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    next(new AppError(401, "Authentication is required"));
    return;
  }

  try {
    request.userId = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token"));
  }
};
