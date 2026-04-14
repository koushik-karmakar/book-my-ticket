import { Router } from "express";
import MovieController from "../controllers/Movie.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protect, (req, res, next) => MovieController.getAll(req, res, next));
router.get("/:id", protect, (req, res, next) => MovieController.getById(req, res, next));

export default router;