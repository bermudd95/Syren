import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import AssistanceRequest from "../models/AssistanceRequest.js";

const router = express.Router();

// GET /api/admin/requests?page=0&limit=25
router.get(
	"/requests",
	verifyFirebaseToken,
	requireAdmin,
	async (req, res) => {
		try {
			const page = Math.max(
				0,
				Number(req.query.page) || 0,
			);
			const limit = Math.min(
				100,
				Number(req.query.limit) || 25,
			);
			const requests = await AssistanceRequest.find()
				.sort({ createdAt: -1 })
				.skip(page * limit)
				.limit(limit)
				.lean();
			const total =
				await AssistanceRequest.countDocuments();
			return res.json({
				requests,
				total,
				page,
				limit,
			});
		} catch (err) {
			console.error("admin list error:", err);
			return res.status(500).json({
				message: "Failed to fetch requests",
			});
		}
	},
);

// GET /api/admin/requests/:id
router.get(
	"/requests/:id",
	verifyFirebaseToken,
	requireAdmin,
	async (req, res) => {
		try {
			const item = await AssistanceRequest.findById(
				req.params.id,
			).lean();
			if (!item)
				return res
					.status(404)
					.json({ message: "Not found" });
			return res.json({ request: item });
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Failed to fetch request",
			});
		}
	},
);

// PATCH /api/admin/requests/:id
router.patch(
	"/requests/:id",
	verifyFirebaseToken,
	requireAdmin,
	async (req, res) => {
		try {
			const allowed = [
				"status",
				"notes",
				"assignedTo",
			];
			const updates = {};
			for (const k of allowed)
				if (k in req.body) updates[k] = req.body[k];
			const updated =
				await AssistanceRequest.findByIdAndUpdate(
					req.params.id,
					{ $set: updates },
					{ new: true },
				).lean();
			return res.json({ request: updated });
		} catch (err) {
			console.error("admin patch error:", err);
			return res.status(500).json({
				message: "Failed to update request",
			});
		}
	},
);

// DELETE /api/admin/requests/:id
router.delete(
	"/requests/:id",
	verifyFirebaseToken,
	requireAdmin,
	async (req, res) => {
		try {
			await AssistanceRequest.findByIdAndDelete(
				req.params.id,
			);
			return res.json({ message: "Deleted" });
		} catch (err) {
			console.error(err);
			return res
				.status(500)
				.json({ message: "Failed to delete" });
		}
	},
);

export default router;
