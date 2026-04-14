import pool from "../config/db.js";

class OtpModel {
    async create(email, otp) {
        await pool.query(
            "DELETE FROM otp_verifications WHERE email = $1",
            [email]
        );

        const result = await pool.query(
            `INSERT INTO otp_verifications (email, otp, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
       RETURNING *`,
            [email, otp]
        );
        return result.rows[0];
    }

    async findByEmail(email) {
        const result = await pool.query(
            `SELECT * FROM otp_verifications
       WHERE email = $1 AND expires_at > NOW()`,
            [email]
        );
        return result.rows[0] || null;
    }

    async deleteByEmail(email) {
        await pool.query(
            "DELETE FROM otp_verifications WHERE email = $1",
            [email]
        );
    }

    async deleteExpired() {
        await pool.query(
            "DELETE FROM otp_verifications WHERE expires_at < NOW()"
        );
    }
}

export default new OtpModel();