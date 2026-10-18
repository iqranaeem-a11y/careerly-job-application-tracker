import { Request, Response } from "express";
import { getJobStats } from "../services/stats.service";
import { AppError } from "../utils/AppError";

export const getStats = async (request: Request, response: Response) => {
  if (!request.userId) {
    throw new AppError(401, "Authentication is required");
  }

  response.json({ stats: await getJobStats(request.userId) });
};
