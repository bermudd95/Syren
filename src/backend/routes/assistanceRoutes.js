import express from "express";
import { verifyToken } from "../middleware/auth.js"; // Middleware to verify Firebase ID token
import AssistanceRequest from "../models/AssistanceRequest.js";

const router = express.Router();

router.post("/request", verifyToken, async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			location,
			reason,
			date,
			priority,
		} = req.body;

		if (!name || !reason || !priority) {
			return res.status(400).json({
				message: "Missing required fields.",
			});
		}

		const request = new AssistanceRequest({
			name,
			email,
			phone,
			location,
			reason,
			priority,
			date:
				date ||
				new Date().toISOString().slice(0, 10),
			userId: req.user.uid, // Comes from verified token middleware
		});

		await request.save();
		res.status(201).json({
			message: "Request logged.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error." });
	}
});

export default router;
