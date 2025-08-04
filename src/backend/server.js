import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () =>
	console.log(
		`Server running on port ${process.env.PORT}`,
	),
);
