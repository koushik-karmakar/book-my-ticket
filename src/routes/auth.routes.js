import { Router } from "express";
import AuthController from "../controllers/Auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  refreshSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), (req, res, next) => AuthController.register(req, res, next));
router.post("/verify-otp", validate(verifyOtpSchema), (req, res, next) => AuthController.verifyOtp(req, res, next));
router.post("/resend-otp", validate(resendOtpSchema), (req, res, next) => AuthController.resendOtp(req, res, next));
router.post("/login", validate(loginSchema), (req, res, next) => AuthController.login(req, res, next));
router.post("/refresh", validate(refreshSchema), (req, res, next) => AuthController.refresh(req, res, next));
router.post("/logout", protect, (req, res, next) => AuthController.logout(req, res, next));
router.get("/me", protect, (req, res) => AuthController.me(req, res));

export default router;