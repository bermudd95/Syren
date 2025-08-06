import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: process.env.VITE_FIREBASE_CLIENT_EMAIL,
		privateKey:
			process.env.VITE_FIREBASE_PRIVATE_KEY.replace(
				/\\n/g,
				"\n",
			),
	}),
});

export default admin;
