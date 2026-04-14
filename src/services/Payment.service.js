import PaymentModel from "../models/Payment.model.js";
import BookingModel from "../models/Booking.model.js";

class PaymentService {
  async initiatePayment(bookingId, userId) {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      const err = new Error("Booking not found");
      err.status = 404;
      throw err;
    }
    const payment = await PaymentModel.create(bookingId, userId, booking.total_amount);
    return payment;
  }

  async confirmPayment(bookingId, transactionId, paymentMethod) {
    const payment = await PaymentModel.updateStatus(
      bookingId, "success", transactionId, paymentMethod
    );
    await BookingModel.updateStatus(bookingId, "confirmed");
    return payment;
  }

  async failPayment(bookingId) {
    await PaymentModel.updateStatus(bookingId, "failed", null, null);
    await BookingModel.updateStatus(bookingId, "cancelled");
  }
}

export default new PaymentService();