import pool from "../config/db.js";

class PaymentModel {
  async create(bookingId, userId, amount) {
    const result = await pool.query(
      `INSERT INTO payments (booking_id, user_id, amount, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [bookingId, userId, amount]
    );
    return result.rows[0];
  }

  async updateStatus(bookingId, status, transactionId, paymentMethod) {
    const result = await pool.query(
      `UPDATE payments
       SET status = $2, transaction_id = $3, payment_method = $4
       WHERE booking_id = $1
       RETURNING *`,
      [bookingId, status, transactionId, paymentMethod]
    );
    return result.rows[0];
  }

  async findByBooking(bookingId) {
    const result = await pool.query(
      "SELECT * FROM payments WHERE booking_id = $1",
      [bookingId]
    );
    return result.rows[0] || null;
  }
}

export default new PaymentModel();