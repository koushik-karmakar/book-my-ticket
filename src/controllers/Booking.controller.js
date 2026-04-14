import BookingService from "../services/Booking.service.js";

class BookingController {
  async lockSeats(req, res, next) {
    try {
      const { seat_ids, show_id } = req.body;
      const result = await BookingService.lockSeats(seat_ids, show_id, req.user.id);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async createBooking(req, res, next) {
    try {
      const { seat_ids, show_id } = req.body;
      const booking = await BookingService.createBooking(seat_ids, show_id, req.user.id);
      res.status(201).json({ success: true, data: booking });
    } catch (err) { next(err); }
  }

  async releaseSeats(req, res, next) {
    try {
      const { seat_ids, show_id } = req.body;
      const result = await BookingService.releaseSeats(seat_ids, show_id, req.user.id);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async myBookings(req, res, next) {
    try {
      const bookings = await BookingService.getUserBookings(req.user.id);
      res.status(200).json({ success: true, data: bookings });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
      res.status(200).json({ success: true, data: booking });
    } catch (err) { next(err); }
  }
}

export default new BookingController();