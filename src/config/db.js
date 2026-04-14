import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // max: 20,
  // connectionTimeoutMillis: 0,
  // idleTimeoutMillis: 0,
});

export default pool;
