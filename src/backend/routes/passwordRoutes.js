import express from "express";
import admin from "../config/firebaseAdmin.js";
import { sendEmail } from "../utilities/sendEmail.js"; // named export expected

const router = express.Router();

/**
 * POST /api/password/send-reset
 * Body: { email }
 *
 * Generates Firebase password reset link and sends a custom email.
 * Returns a generic success response (to avoid account enumeration).
 */
router.post("/send-reset", async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res
				.status(400)
				.json({ message: "Missing email" });
		}

		const actionCodeSettings = {
			url: `${
				process.env.VITE_FRONTEND_URL ||
				"http://localhost:5173"
			}/reset-password`,
			handleCodeInApp: false,
		};

		// Try to generate a password reset link. If user doesn't exist, generatePasswordResetLink throws.
		let resetLink;
		try {
			resetLink = await admin
				.auth()
				.generatePasswordResetLink(
					email,
					actionCodeSettings,
				);
		} catch (err) {
			console.warn(
				"generatePasswordResetLink error (may be nonexistent user):",
				err.message,
			);
			// Return generic success response (do not reveal whether email exists)
			return res.json({
				message:
					"If the email exists, you will receive a reset link shortly.",
			});
		}

		// Try to fetch a user displayName for personalization
		let username = "there";
		try {
			const userRecord = await admin
				.auth()
				.getUserByEmail(email);
			username = userRecord.displayName || username;
		} catch (err) {
			// ignore - just use default username
		}

		// Send the custom email using your sendEmail utility
		try {
			await sendEmail("reset", {
				email,
				username,
				resetLink,
			});
			console.log(
				`Custom reset email sent to: ${email}`,
			);
		} catch (emailErr) {
			console.error(
				"Failed to send custom reset email:",
				emailErr,
			);
			// We still return generic success to the client
		}

		return res.json({
			message:
				"If the email exists, you will receive a reset link shortly.",
		});
	} catch (err) {
		console.error("send-reset error:", err);
		return res.status(500).json({
			message: "Unable to send reset email",
		});
	}
});

export default router;
