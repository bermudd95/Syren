import admin from "../firebaseAdmin.js";

export const verifyFirebaseToken = async (
	req,
	res,
	next,
) => {
	try {
		const authHeader = req.headers.authorization || "";
		const match = authHeader.match(/^Bearer (.*)$/);
		if (!match) {
			return res
				.status(401)
				.json({ message: "No token provided" });
		}
		const idToken = match[1];
		const decoded = await admin
			.auth()
			.verifyIdToken(idToken);
		req.firebaseUser = decoded;
		next();
	} catch (err) {
		console.error("Token verification error", err);
		return res
			.status(401)
			.json({ message: "Invalid or expired token" });
	}
};
