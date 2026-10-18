import { JobStatus } from "./job";

export interface JobStats {
  total: number;
  byStatus: Record<JobStatus, number>;
  applicationsPerMonth: { month: string; count: number }[];
  interviewRate: number;
  offerRate: number;
}
