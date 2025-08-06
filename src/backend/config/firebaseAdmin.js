import admin from "firebase-admin";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localKeyPath = join(
	__dirname,
	"serviceAccountKey.json",
);

if (fs.existsSync(localKeyPath)) {
	// Use local JSON key (dev)
	const serviceAccount = JSON.parse(
		fs.readFileSync(localKeyPath, "utf8"),
	);
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
	console.log(
		"Firebase Admin initialized using local serviceAccountKey.json",
	);
} else if (base64Env) {
	// Use base64-encoded service account from env (safer for CI/prod)
	const json = Buffer.from(base64Env, "base64").toString(
		"utf8",
	);
	const serviceAccount = JSON.parse(json);
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
	console.log(
		"Firebase Admin initialized using VITE_FIREBASE_SERVICE_ACCOUNT_BASE64",
	);
} else {
	// fallback — this will work only if running in a GCP environment with default credentials
	try {
		admin.initializeApp();
		console.log(
			"Firebase Admin initialized using default credentials",
		);
	} catch (err) {
		console.error(
			"Failed to initialize Firebase Admin:",
			err,
		);
		throw err;
	}
}

export default admin;
