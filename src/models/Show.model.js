import pool from "../config/db.js";

class ShowModel {
  async findByMovie(movieId) {
    const result = await pool.query(
      `SELECT sh.*, m.title, m.duration, m.genre, sc.name as screen_name
       FROM shows sh
       JOIN movies m  ON sh.movie_id  = m.id
       JOIN screens sc ON sh.screen_id = sc.id
       WHERE sh.movie_id = $1 AND sh.status = 'active'
       ORDER BY sh.show_time`,
      [movieId]
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT sh.*, m.title, sc.name as screen_name
       FROM shows sh
       JOIN movies m   ON sh.movie_id  = m.id
       JOIN screens sc ON sh.screen_id = sc.id
       WHERE sh.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}

export default new ShowModel();