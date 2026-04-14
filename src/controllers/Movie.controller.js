import MovieModel from "../models/Movie.model.js";

class MovieController {
  async getAll(req, res, next) {
    try {
      const movies = await MovieModel.findAll();
      res.status(200).json({ success: true, data: movies });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const movie = await MovieModel.findById(req.params.id);
      if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
      res.status(200).json({ success: true, data: movie });
    } catch (err) { next(err); }
  }
}

export default new MovieController();