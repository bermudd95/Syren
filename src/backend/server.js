import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import assistanceRoutes from "./src/backend/routes/assistanceRoutes.js";
import adminRoutes from "./src/backend/routes/adminRequests.js";
import passwordRoutes from "./routes/passwordRoutes.js";
// import any other route files similarly (assistanceRoutes, authRoutes, etc.)

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND =
	process.env.VITE_FRONTEND_URL ||
	"http://localhost:5173";

app.use(express.json());
app.use(cors({ origin: FRONTEND, credentials: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// Mount routes
app.use("/api/password", passwordRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/admin", adminRoutes);

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

app.get("/health", (req, res) => res.json({ ok: true }));
app.listen(PORT, () => {
	console.log(
		`Server running on http://localhost:${PORT}`,
	);
});
