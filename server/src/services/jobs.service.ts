import { JobStatus, Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

type JobInput = {
  company?: string;
  position?: string;
  location?: string | null;
  jobUrl?: string | null;
  salary?: string | null;
  status?: JobStatus;
  appliedDate?: string;
  followUpDate?: string | null;
  notes?: string | null;
};

type JobFields = {
  company?: string;
  position?: string;
  location?: string | null;
  jobUrl?: string | null;
  salary?: string | null;
  status?: JobStatus;
  appliedDate?: Date;
  followUpDate?: Date | null;
  notes?: string | null;
};

const toJobData = (input: JobInput): JobFields => ({
  ...input,
  appliedDate: input.appliedDate ? new Date(`${input.appliedDate}T00:00:00.000Z`) : undefined,
  followUpDate:
    input.followUpDate === undefined
      ? undefined
      : input.followUpDate === null
        ? null
        : new Date(`${input.followUpDate}T00:00:00.000Z`)
});

const startOfDay = (date: string) => new Date(`${date}T00:00:00.000Z`);
const endOfDay = (date: string) => new Date(`${date}T23:59:59.999Z`);

export const listJobs = async (
  userId: string,
  filters: { search?: string; status?: JobStatus; from?: string; to?: string }
) => {
  const where: Prisma.JobWhereInput = {
    userId,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search
      ? {
          OR: [
            { company: { contains: filters.search, mode: "insensitive" } },
            { position: { contains: filters.search, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(filters.from || filters.to
      ? {
          appliedDate: {
            ...(filters.from ? { gte: startOfDay(filters.from) } : {}),
            ...(filters.to ? { lte: endOfDay(filters.to) } : {})
          }
        }
      : {})
  };

  return prisma.job.findMany({
    where,
    orderBy: [{ appliedDate: "desc" }, { createdAt: "desc" }]
  });
};

export const createJob = async (
  userId: string,
  input: JobInput & { company: string; position: string }
) =>
  prisma.job.create({
    data: {
      ...toJobData(input),
      userId,
      company: input.company,
      position: input.position
    }
  });

export const updateJob = async (userId: string, jobId: string, input: JobInput) => {
  const result = await prisma.job.updateMany({
    where: { id: jobId, userId },
    data: toJobData(input)
  });

  if (result.count === 0) {
    throw new AppError(404, "Job application not found");
  }

  return prisma.job.findFirstOrThrow({ where: { id: jobId, userId } });
};

export const updateJobStatus = async (userId: string, jobId: string, status: JobStatus) => {
  const result = await prisma.job.updateMany({
    where: { id: jobId, userId },
    data: { status }
  });

  if (result.count === 0) {
    throw new AppError(404, "Job application not found");
  }

  return prisma.job.findFirstOrThrow({ where: { id: jobId, userId } });
};

export const deleteJob = async (userId: string, jobId: string) => {
  const result = await prisma.job.deleteMany({ where: { id: jobId, userId } });

  if (result.count === 0) {
    throw new AppError(404, "Job application not found");
  }
};
