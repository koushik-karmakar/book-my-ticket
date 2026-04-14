import { Router } from "express";
import ShowController from "../controllers/Show.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.get("/movie/:movieId", protect, (req, res, next) =>
  ShowController.getByMovie(req, res, next),
);
router.get("/:id", protect, (req, res, next) =>
  ShowController.getById(req, res, next),
);

export default router;
