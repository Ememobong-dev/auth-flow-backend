import { Router } from "express";
import {
  registerLimiter,
  loginLimiter,
  resetPasswordRequestLimiter,
  resetPasswordLimiter,
} from "./../../middlewares/rate-limit.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import {
  registerController,
  loginController,
  requestResetPasswordController,
  ResetPasswordController,
} from "./auth.controller.js";

const router = Router();

router.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  registerController,
);

router.post(
  "/login", 
  loginLimiter, 
  validate(loginSchema), 
  loginController
);

router.post(
  "/forgot-password",
  resetPasswordRequestLimiter,
  validate(resetPasswordRequestSchema),
  requestResetPasswordController,
);

router.post(
  "/reset-password",
  resetPasswordLimiter,
  validate(registerSchema),
  ResetPasswordController,
);



export { router as authRouter}
