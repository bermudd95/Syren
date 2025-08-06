import dotenv from "dotenv";
dotenv.config(); // MUST run before any code that reads process.env

import express from "express";
import cors from "cors";
import path from "path";

// import your routes AFTER dotenv.config()
import passwordRoutes from "./routes/passwordRoutes.js";
// import any other route files similarly (assistanceRoutes, authRoutes, etc.)

const app = express();

const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());

// CORS: allow your frontend origin (adjust if using different host/port)
const FRONTEND =
	process.env.VITE_FRONTEND_URL ||
	"http://localhost:5173";
app.use(cors({ origin: FRONTEND, credentials: true }));

// Serve static files (logo, etc.) from a public folder if present
// e.g., place logo at /public/logo.png and it will be available at http://localhost:5000/logo.png
app.use(express.static(path.join(process.cwd(), "public")));

// Mount routes
app.use("/api/password", passwordRoutes);

// Catch-all simple health check
app.get("/health", (req, res) =>
	res.json({ ok: true, time: new Date().toISOString() }),
);

// 404 fallback for /api
app.use("/api", (req, res) =>
	res
		.status(404)
		.json({ message: "API route not found" }),
);

app.listen(PORT, () => {
	console.log(
		`Server running on http://localhost:${PORT}`,
	);
});
