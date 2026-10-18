import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/AppError";

type RequestPart = "body" | "query" | "params";

export const validate = (
  schema: ZodType,
  part: RequestPart = "body"
): RequestHandler => (request: Request, _response: Response, next: NextFunction) => {
  const result = schema.safeParse(request[part]);

  if (!result.success) {
    next(new AppError(400, "Request validation failed", result.error.issues));
    return;
  }

  request[part] = result.data;
  next();
};
