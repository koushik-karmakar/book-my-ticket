import PaymentService from "../services/Payment.service.js";

class PaymentController {
  async initiate(req, res, next) {
    try {
      const { booking_id } = req.body;
      const payment = await PaymentService.initiatePayment(booking_id, req.user.id);
      res.status(200).json({ success: true, data: payment });
    } catch (err) { next(err); }
  }

  async confirm(req, res, next) {
    try {
      const { booking_id, transaction_id, payment_method } = req.body;
      const payment = await PaymentService.confirmPayment(booking_id, transaction_id, payment_method);
      res.status(200).json({ success: true, data: payment });
    } catch (err) { next(err); }
  }

  async fail(req, res, next) {
    try {
      const { booking_id } = req.body;
      await PaymentService.failPayment(booking_id);
      res.status(200).json({ success: true, message: "Payment failed, seats released" });
    } catch (err) { next(err); }
  }
}

export default new PaymentController();