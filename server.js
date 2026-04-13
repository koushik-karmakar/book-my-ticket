import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import pool from "./src/config/db.js";

const port = process.env.PORT || 8080;

pool
    .query("SELECT 1")
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB failed:", err.message));

app.listen(port, () => console.log(`Server running on port: ${port}`));