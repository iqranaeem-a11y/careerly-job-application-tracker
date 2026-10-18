import { Request, Response } from "express";
import { authenticateUser, getPublicUser, registerUser } from "../services/auth.service";
import { AppError } from "../utils/AppError";
import { createAccessToken } from "../utils/jwt";

export const register = async (request: Request, response: Response) => {
  const user = await registerUser(request.body);
  response.status(201).json({ user, accessToken: createAccessToken(user.id) });
};

export const login = async (request: Request, response: Response) => {
  const user = await authenticateUser(request.body.email, request.body.password);
  response.json({ user, accessToken: createAccessToken(user.id) });
};

export const me = async (request: Request, response: Response) => {
  if (!request.userId) {
    throw new AppError(401, "Authentication is required");
  }

  response.json({ user: await getPublicUser(request.userId) });
};
