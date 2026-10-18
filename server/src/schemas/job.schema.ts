import { JobStatus } from "@prisma/client";
import { z } from "zod";

const dateSchema = z.string().date();
const nullableText = (max: number) => z.string().trim().max(max).nullable().optional();

export const jobStatusSchema = z.nativeEnum(JobStatus);

export const createJobSchema = z.object({
  company: z.string().trim().min(1).max(120),
  position: z.string().trim().min(1).max(120),
  location: nullableText(120),
  jobUrl: z
    .union([z.string().trim().url().max(2048), z.literal("")])
    .nullable()
    .optional()
    .transform((value) => (value === "" ? null : value)),
  salary: nullableText(100),
  status: jobStatusSchema.default(JobStatus.APPLIED),
  appliedDate: dateSchema.optional(),
  followUpDate: dateSchema.nullable().optional(),
  notes: nullableText(5000)
});

export const updateJobSchema = createJobSchema
  .omit({ status: true })
  .extend({ status: jobStatusSchema })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field must be provided");

export const updateJobStatusSchema = z.object({ status: jobStatusSchema });

export const jobIdSchema = z.object({ id: z.string().min(1) });

export const jobQuerySchema = z
  .object({
    search: z.string().trim().max(200).optional(),
    status: jobStatusSchema.optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional()
  })
  .refine(
    ({ from, to }) => !from || !to || from <= to,
    { message: "'from' must be on or before 'to'", path: ["from"] }
  );
