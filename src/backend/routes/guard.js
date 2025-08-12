import express from "express";
import GuardShift from "../models/GuardCheckIn.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.post(
	"/checkin",
	verifyFirebaseToken,
	async (req, res) => {
		try {
			const {
				guardName,
				phone,
				email,
				siteId,
				location,
				priority,
			} = req.body;
			if (
				!guardName ||
				!siteId ||
				!location ||
				location.lat == null ||
				location.lng == null
			) {
				return res.status(400).json({
					message: "Missing required fields",
				});
			}

			const guardUid = req.firebaseUser?.uid || null;

			const shift = new GuardShift({
				guardName,
				phone,
				email,
				siteId,
				location,
				priority: priority || "Low",
				guardUid,
				checkInTime: new Date(),
				status: "checked-in",
			});

			const saved = await shift.save();

			// emit to site room only
			const io = req.app.get("io");
			if (io) {
				io.to(`site:${siteId}`).emit(
					"guardCheckedIn",
					{
						id: saved._id,
						guardName: saved.guardName,
						phone: saved.phone,
						email: saved.email,
						siteId: saved.siteId,
						location: saved.location,
						checkInTime: saved.checkInTime,
						priority: saved.priority,
						guardUid: saved.guardUid,
					},
				);
			}

			return res.status(201).json({
				message: "Checked in",
				shiftId: saved._id,
				shift: saved,
			});
		} catch (err) {
			console.error("checkin error:", err);
			return res
				.status(500)
				.json({ message: "Server error" });
		}
	},
);

/**
 * POST /api/guardShift/checkout/:id
 * Requires Firebase auth (guard or admin)
 */
router.post(
	"/checkout/:id",
	verifyFirebaseToken,
	async (req, res) => {
		try {
			const shift = await GuardShift.findById(
				req.params.id,
			);
			if (!shift)
				return res
					.status(404)
					.json({ message: "Shift not found" });

			shift.checkOutTime = new Date();
			shift.status = "checked-out";
			await shift.save();

			const io = req.app.get("io");
			if (io) {
				io.to(`site:${shift.siteId}`).emit(
					"guardCheckedOut",
					{ id: shift._id, siteId: shift.siteId },
				);
			}

			return res.json({
				message: "Checked out",
				shift,
			});
		} catch (err) {
			console.error("checkout error:", err);
			return res
				.status(500)
				.json({ message: "Server error" });
		}
	},
);

/**
 * GET /api/guardShift/checkins?siteId=...
 * Returns recent active checkins for site (optionally all).
 */
router.get("/checkins", async (req, res) => {
	try {
		const { siteId } = req.query;
		const query = siteId
			? { siteId, status: "checked-in" }
			: { status: "checked-in" };
		const items = await GuardShift.find(query)
			.sort({ checkInTime: -1 })
			.lean();
		res.json({ checkins: items });
	} catch (err) {
		console.error("get checkins error:", err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
