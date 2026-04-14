import SeatModel from "../models/Seat.model.js";

class SeatController {
  async getByShow(req, res, next) {
    try {
      const seats = await SeatModel.findByShow(req.params.showId);
      res.status(200).json({ success: true, data: seats });
    } catch (err) { next(err); }
  }
}

export default new SeatController();