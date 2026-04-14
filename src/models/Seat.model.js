import pool from "../config/db.js";

class SeatModel {
  async findByShow(showId) {
    const result = await pool.query(
      `SELECT
        s.id,
        s.seat_number,
        s.seat_row,
        CASE
          WHEN bs.seat_id IS NOT NULL THEN 'booked'
          WHEN sl.seat_id IS NOT NULL AND sl.expires_at > NOW() THEN 'locked'
          ELSE 'available'
        END AS status,
        sl.user_id AS locked_by
       FROM seats s
       JOIN shows sh ON sh.id = $1
       LEFT JOIN booking_seats bs ON bs.seat_id = s.id AND bs.show_id = $1
       LEFT JOIN seat_locks    sl ON sl.seat_id = s.id AND sl.show_id = $1
                                  AND sl.expires_at > NOW()
       WHERE s.screen_id = sh.screen_id
       ORDER BY s.seat_row, s.seat_number`,
      [showId]
    );
    return result.rows;
  }
}

export default new SeatModel();