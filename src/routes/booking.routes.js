import { Router } from "express";
import BookingController from "../controllers/Booking.controller.js";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { lockSeatsSchema, createBookingSchema } from "../validators/booking.validator.js";

const router = Router();

router.post("/lock-seats", protect, validate(lockSeatsSchema), (req, res, next) => BookingController.lockSeats(req, res, next));
router.post("/release-seats", protect, (req, res, next) => BookingController.releaseSeats(req, res, next));
router.post("/", protect, validate(createBookingSchema), (req, res, next) => BookingController.createBooking(req, res, next));
router.get("/my", protect, (req, res, next) => BookingController.myBookings(req, res, next));
router.get("/:id", protect, (req, res, next) => BookingController.getById(req, res, next));

export default router;