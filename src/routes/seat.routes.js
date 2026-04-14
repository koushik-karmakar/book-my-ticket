import { Router } from "express";
import SeatController from "../controllers/Seat.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/show/:showId", protect, (req, res, next) => SeatController.getByShow(req, res, next));

export default router;