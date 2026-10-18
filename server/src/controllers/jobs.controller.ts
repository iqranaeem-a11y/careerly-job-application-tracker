import { Request, Response } from "express";
import {
  createJob,
  deleteJob,
  listJobs,
  updateJob,
  updateJobStatus
} from "../services/jobs.service";
import { AppError } from "../utils/AppError";
import { jobQuerySchema } from "../schemas/job.schema";

const getUserId = (request: Request) => {
  if (!request.userId) {
    throw new AppError(401, "Authentication is required");
  }
  return request.userId;
};

const getJobId = (request: Request) => {
  const { id } = request.params;
  if (typeof id !== "string") {
    throw new AppError(400, "Invalid job application id");
  }
  return id;
};

export const getJobs = async (request: Request, response: Response) => {
  const filters = jobQuerySchema.parse(request.query);
  response.json({ jobs: await listJobs(getUserId(request), filters) });
};

export const postJob = async (request: Request, response: Response) => {
  const job = await createJob(getUserId(request), request.body);
  response.status(201).json({ job });
};

export const putJob = async (request: Request, response: Response) => {
  const job = await updateJob(
    getUserId(request),
    getJobId(request),
    request.body
  );
  response.json({ job });
};

export const patchJobStatus = async (request: Request, response: Response) => {
  const job = await updateJobStatus(
    getUserId(request),
    getJobId(request),
    request.body.status
  );
  response.json({ job });
};

export const removeJob = async (request: Request, response: Response) => {
  await deleteJob(getUserId(request), getJobId(request));
  response.status(204).send();
};
