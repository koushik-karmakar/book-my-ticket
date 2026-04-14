import pg from "pg";
const pool = new pg.Pool({
  connectionString: "postgresql://postgres:VjoqKKicfDFAjsZUOaARqZkavqRATuIs@:/railway",
  ssl: { rejectUnauthorized: false },
});

export default pool;
