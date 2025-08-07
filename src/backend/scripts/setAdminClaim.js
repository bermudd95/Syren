import dotenv from "dotenv";
dotenv.config();

import admin from "../src/backend/config/firebaseAdmin.js"; // adjust path if needed

if (process.argv.length < 3) {
	console.error(
		"Usage: node scripts/setAdminClaim.js <firebase-uid>",
	);
	process.exit(1);
}
const uid = process.argv[2];

async function run() {
	try {
		await admin
			.auth()
			.setCustomUserClaims(uid, { admin: true });
		console.log(
			`Custom claim 'admin: true' set for uid: ${uid}`,
		);
		// Optionally show token support instruction
		console.log(
			"Instruct the user to sign out and back in, or call getIdToken(true) to refresh token.",
		);
		process.exit(0);
	} catch (err) {
		console.error("Failed to set custom claim:", err);
		process.exit(2);
	}
}
run();
