import { Router } from "express";
import PaymentController from "../controllers/Payment.controller.js";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { confirmPaymentSchema } from "../validators/payment.validator.js";

const router = Router();

router.post("/initiate", protect, (req, res, next) => PaymentController.initiate(req, res, next));
router.post("/confirm", protect, validate(confirmPaymentSchema), (req, res, next) => PaymentController.confirm(req, res, next));
router.post("/fail", protect, (req, res, next) => PaymentController.fail(req, res, next));

export default router;