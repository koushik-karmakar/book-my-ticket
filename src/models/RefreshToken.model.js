import pool from "../config/db.js";

class RefreshTokenModel {
    async create(userId, token) {
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
            [userId, token]
        );
    }

    async findByToken(token) {
        const result = await pool.query(
            `SELECT * FROM refresh_tokens
       WHERE token = $1 AND expires_at > NOW()`,
            [token]
        );
        return result.rows[0] || null;
    }

    async deleteByToken(token) {
        await pool.query(
            "DELETE FROM refresh_tokens WHERE token = $1",
            [token]
        );
    }

    async deleteByUser(userId) {
        await pool.query(
            "DELETE FROM refresh_tokens WHERE user_id = $1",
            [userId]
        );
    }
}

export default new RefreshTokenModel();