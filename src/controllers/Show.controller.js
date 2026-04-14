import ShowModel from "../models/Show.model.js";

class ShowController {
  async getByMovie(req, res, next) {
    try {
      const shows = await ShowModel.findByMovie(req.params.movieId);
      res.status(200).json({ success: true, data: shows });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const show = await ShowModel.findById(req.params.id);
      if (!show) return res.status(404).json({ success: false, message: "Show not found" });
      res.status(200).json({ success: true, data: show });
    } catch (err) { next(err); }
  }
}

export default new ShowController();