import pool from "../config/db.js";

class BookingModel {
  async create(userId, showId, totalAmount, seatIds) {
    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");

      // create booking
      const booking = await conn.query(
        `INSERT INTO bookings (user_id, show_id, total_amount, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING *`,
        [userId, showId, totalAmount]
      );

      const bookingId = booking.rows[0].id;

      // insert booking seats
      for (const seatId of seatIds) {
        await conn.query(
          `INSERT INTO booking_seats (booking_id, seat_id, show_id)
           VALUES ($1, $2, $3)`,
          [bookingId, seatId, showId]
        );
      }

      // release seat locks
      await conn.query(
        `DELETE FROM seat_locks
         WHERE seat_id = ANY($1) AND show_id = $2`,
        [seatIds, showId]
      );

      await conn.query("COMMIT");
      return booking.rows[0];
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err;
    } finally {
      conn.release();
    }
  }

  async findByUser(userId) {
    const result = await pool.query(
      `SELECT b.*, m.title, sh.show_time, sh.price
       FROM bookings b
       JOIN shows  sh ON b.show_id  = sh.id
       JOIN movies m  ON sh.movie_id = m.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT b.*, m.title, sh.show_time,
              json_agg(json_build_object(
                'seat_id', bs.seat_id,
                'seat_number', s.seat_number,
                'seat_row', s.seat_row
              )) as seats
       FROM bookings b
       JOIN shows         sh ON b.show_id   = sh.id
       JOIN movies        m  ON sh.movie_id  = m.id
       JOIN booking_seats bs ON bs.booking_id = b.id
       JOIN seats         s  ON bs.seat_id   = s.id
       WHERE b.id = $1
       GROUP BY b.id, m.title, sh.show_time`,
      [id]
    );
    return result.rows[0] || null;
  }

  async updateStatus(bookingId, status) {
    await pool.query(
      "UPDATE bookings SET status = $2 WHERE id = $1",
      [bookingId, status]
    );
  }
}

export default new BookingModel();