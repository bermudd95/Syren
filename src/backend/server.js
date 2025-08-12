import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import cors from "cors";
import path from "path";
import admin from "./src/backend/config/firebaseAdmin.js"; // firebase admin
import guardShiftRoutes from "./src/backend/routes/guard.js";
import assistanceRoutes from "./src/backend/routes/assistanceRoutes.js";
import adminRoutes from "./src/backend/routes/adminRequests.js";
import passwordRoutes from "./routes/passwordRoutes.js";
// import any other route files similarly (assistanceRoutes, authRoutes, etc.)

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
	cors: {
		origin:
			process.env.VITE_FRONTEND_URL ||
			"http://localhost:5173",
		credentials: true,
	},
});

app.use(express.json());
app.use(
	cors({
		origin:
			process.env.VITE_FRONTEND_URL ||
			"http://localhost:5173",
		credentials: true,
	}),
);
app.use(express.static(path.join(process.cwd(), "public")));

// make io available to routes via app
app.set("io", io);

// Mount routes
app.use("/api/password", passwordRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/guardShift", guardShiftRoutes);
app.use("/api/assistance", assistanceRoutes);

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
// socket auth middleware
io.use(async (socket, next) => {
	try {
		const token = socket.handshake?.auth?.token;
		if (!token) {
			// allow unauthenticated sockets if desired:
			return next();
			// OR reject:
			// return next(new Error("Authentication required"));
		}
		const decoded = await admin
			.auth()
			.verifyIdToken(token);
		socket.user = decoded;
		next();
	} catch (err) {
		console.warn("Socket auth failed:", err.message);
		next(); // allow anonymous but you can next(new Error(...)) to reject
	}
});

io.on("connection", (socket) => {
	console.log(
		"Socket connected:",
		socket.id,
		"uid:",
		socket.user?.uid || "anon",
	);

	socket.on("joinSite", ({ siteId }) => {
		if (!siteId) return;
		socket.join(`site:${siteId}`);
		console.log(
			`Socket ${socket.id} joined room site:${siteId}`,
		);
	});

	socket.on("leaveSite", ({ siteId }) => {
		if (!siteId) return;
		socket.leave(`site:${siteId}`);
		console.log(
			`Socket ${socket.id} left room site:${siteId}`,
		);
	});

	socket.on("disconnect", (reason) => {
		console.log(
			"Socket disconnect:",
			socket.id,
			reason,
		);
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
	console.log(
		`Server running on http://localhost:${PORT}`,
	),
);
