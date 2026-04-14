import SeatLockModel from "../models/SeatLock.model.js";
import BookingModel from "../models/Booking.model.js";
import ShowModel from "../models/Show.model.js";

class BookingService {
  async lockSeats(seatIds, showId, userId) {
    const result = await SeatLockModel.lockSeats(seatIds, showId, userId);
    if (!result.success) {
      const err = new Error(result.error);
      err.status = 409;
      throw err;
    }
    return { success: true, message: "Seats locked for 5 minutes" };
  }

  async createBooking(seatIds, showId, userId) {
    const locked = await SeatLockModel.verifyLocks(seatIds, showId, userId);
    if (!locked) {
      const err = new Error("Seat locks expired. Please select seats again.");
      err.status = 409;
      throw err;
    }

    const show = await ShowModel.findById(showId);
    const totalAmount = show.price * seatIds.length;
    const booking = await BookingModel.create(userId, showId, totalAmount, seatIds);
    return booking;
  }

  async getUserBookings(userId) {
    return BookingModel.findByUser(userId);
  }

  async getBookingById(bookingId) {
    return BookingModel.findById(bookingId);
  }

  async releaseSeats(seatIds, showId, userId) {
    await SeatLockModel.releaseSeats(seatIds, showId, userId);
    return { success: true };
  }
}

export default new BookingService();