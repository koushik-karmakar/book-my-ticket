import SeatModel from "../models/Seat.model.js";

class SeatService {
  async getAllSeats() {
    return SeatModel.findAll();
  }

  async bookSeat(seatId, userId) {
    const result = await SeatModel.bookSeat(seatId, userId);
    if (!result.success) {
      const err = new Error(result.error);
      err.status = 409;
      throw err;
    }
    return result;
  }
}

export default new SeatService();
