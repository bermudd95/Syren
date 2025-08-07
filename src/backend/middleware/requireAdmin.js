export function requireAdmin(req, res, next) {
	const user = req.firebaseUser;
	if (!user)
		return res
			.status(401)
			.json({ message: "Not authenticated" });
	// Check custom claim
	if (user.admin === true) return next();
	return res
		.status(403)
		.json({ message: "Admin access required" });
}
