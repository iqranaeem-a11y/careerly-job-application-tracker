export const JOB_STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export interface Job {
  id: string;
  userId: string;
  company: string;
  position: string;
  location: string | null;
  jobUrl: string | null;
  salary: string | null;
  status: JobStatus;
  appliedDate: string;
  followUpDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobInput {
  company: string;
  position: string;
  location: string | null;
  jobUrl: string | null;
  salary: string | null;
  status: JobStatus;
  appliedDate: string;
  followUpDate: string | null;
  notes: string | null;
}

export interface JobFilters {
  search?: string;
  status?: JobStatus | "";
  from?: string;
  to?: string;
}

export const STATUS_LABELS: Record<JobStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected"
};
