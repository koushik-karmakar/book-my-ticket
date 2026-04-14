import pool from "../config/db.js";

class SeatLockModel {
  async lockSeats(seatIds, showId, userId) {
    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");
      await conn.query("DELETE FROM seat_locks WHERE expires_at < NOW()");
      const check = await conn.query(
        `SELECT seat_id FROM seat_locks
         WHERE seat_id = ANY($1) AND show_id = $2 AND expires_at > NOW()`,
        [seatIds, showId]
      );

      if (check.rowCount > 0) {
        await conn.query("ROLLBACK");
        return { success: false, error: "Some seats are already locked" };
      }

      for (const seatId of seatIds) {
        await conn.query(
          `INSERT INTO seat_locks (seat_id, show_id, user_id, expires_at)
           VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes')`,
          [seatId, showId, userId]
        );
      }

      await conn.query("COMMIT");
      return { success: true };
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err;
    } finally {
      conn.release();
    }
  }

  async releaseSeats(seatIds, showId, userId) {
    await pool.query(
      `DELETE FROM seat_locks
       WHERE seat_id = ANY($1) AND show_id = $2 AND user_id = $3`,
      [seatIds, showId, userId]
    );
  }

  async verifyLocks(seatIds, showId, userId) {
    const result = await pool.query(
      `SELECT seat_id FROM seat_locks
       WHERE seat_id = ANY($1)
       AND show_id = $2
       AND user_id = $3
       AND expires_at > NOW()`,
      [seatIds, showId, userId]
    );
    return result.rowCount === seatIds.length;
  }
}

export default new SeatLockModel();