import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const createAccessToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string): string => {
  const payload = jwt.verify(token, env.JWT_SECRET);

  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid access token payload");
  }

  return payload.sub;
};
