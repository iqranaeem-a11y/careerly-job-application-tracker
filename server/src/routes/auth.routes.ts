import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
