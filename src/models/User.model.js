import pool from "../config/db.js";

class UserModel {
  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await pool.query(
      "SELECT id, full_name, last_name, email, is_verified FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async create({ full_name, last_name, email, password }) {
    const result = await pool.query(
      `INSERT INTO users (full_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, last_name, email, is_verified, created_at`,
      [full_name, last_name, email, password]
    );
    return result.rows[0];
  }

  async markVerified(email) {
    await pool.query(
      "UPDATE users SET is_verified = TRUE WHERE email = $1",
      [email]
    );
  }
}

export default new UserModel();