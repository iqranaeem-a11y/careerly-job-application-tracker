import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        message: error.message,
        ...(error.details ? { details: error.details } : {})
      }
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: { message: "Request validation failed", details: error.issues }
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    response.status(409).json({ error: { message: "A record with that value already exists" } });
    return;
  }

  console.error(error);
  response.status(500).json({ error: { message: "An unexpected server error occurred" } });
};
