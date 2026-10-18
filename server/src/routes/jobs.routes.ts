import { Router } from "express";
import {
  getJobs,
  patchJobStatus,
  postJob,
  putJob,
  removeJob
} from "../controllers/jobs.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createJobSchema,
  jobIdSchema,
  jobQuerySchema,
  updateJobSchema,
  updateJobStatusSchema
} from "../schemas/job.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(requireAuth);
router.get("/", validate(jobQuerySchema, "query"), asyncHandler(getJobs));
router.post("/", validate(createJobSchema), asyncHandler(postJob));
router.put("/:id", validate(jobIdSchema, "params"), validate(updateJobSchema), asyncHandler(putJob));
router.patch(
  "/:id/status",
  validate(jobIdSchema, "params"),
  validate(updateJobStatusSchema),
  asyncHandler(patchJobStatus)
);
router.delete("/:id", validate(jobIdSchema, "params"), asyncHandler(removeJob));

export default router;
