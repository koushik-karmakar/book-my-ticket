import express from "express";
import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import showRoutes from "./routes/show.routes.js";
import seatRoutes from "./routes/seat.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import errorHandler from "./utils/errorHandler.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(
    cors({
        origin: process.env.CORS_URL || "http://localhost:8000",
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use(errorHandler);

export default app;
