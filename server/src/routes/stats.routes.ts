import { Router } from "express";
import { getStats } from "../controllers/stats.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", requireAuth, asyncHandler(getStats));

export default router;
