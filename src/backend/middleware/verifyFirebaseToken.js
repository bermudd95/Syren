import admin from "../config/firebaseAdmin.js";

export async function verifyFirebaseToken(req, res, next) {
	const authHeader = req.headers.authorization || "";
	const match = authHeader.match(/^Bearer (.+)$/);
	if (!match) {
		return res.status(401).json({
			message: "Missing Authorization header",
		});
	}
	const idToken = match[1];
	try {
		const decoded = await admin
			.auth()
			.verifyIdToken(idToken);
		req.firebaseUser = decoded; // contains uid and custom claims
		return next();
	} catch (err) {
		console.warn(
			"verifyFirebaseToken failed:",
			err.message,
		);
		return res
			.status(401)
			.json({ message: "Invalid or expired token" });
	}
}
