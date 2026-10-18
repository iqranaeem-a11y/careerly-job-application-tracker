import { Job, JobFilters, JobInput, JobStatus } from "../types/job";
import { api } from "./api";

export const getJobs = async (filters: JobFilters) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)
  );
  const { data } = await api.get<{ jobs: Job[] }>("/jobs", { params });
  return data.jobs;
};

export const createJob = async (input: JobInput) => {
  const { data } = await api.post<{ job: Job }>("/jobs", input);
  return data.job;
};

export const editJob = async (id: string, input: JobInput) => {
  const { data } = await api.put<{ job: Job }>(`/jobs/${id}`, input);
  return data.job;
};

export const changeJobStatus = async (id: string, status: JobStatus) => {
  const { data } = await api.patch<{ job: Job }>(`/jobs/${id}/status`, { status });
  return data.job;
};

export const removeJob = async (id: string) => {
  await api.delete(`/jobs/${id}`);
};
