import { io as ioClient } from "socket.io-client";
import { getAuth } from "firebase/auth";

let socket = null;

export async function connectSocket(siteId) {
	if (socket && socket.connected) {
		// rejoin room if needed
		if (siteId) socket.emit("joinSite", { siteId });
		return socket;
	}

	const auth = getAuth();
	let token = null;
	if (auth.currentUser) {
		token = await auth.currentUser.getIdToken();
	}

	// Use absolute URL if backend on different origin:
	const BACKEND = process.env.REACT_APP_BACKEND_URL || ""; // e.g. http://localhost:5000
	socket = ioClient(BACKEND || "/", {
		auth: { token },
		transports: ["websocket", "polling"],
	});

	socket.on("connect", () => {
		if (siteId) socket.emit("joinSite", { siteId });
	});

	return socket;
}

export function getSocket() {
	return socket;
}

export function disconnectSocket() {
	if (socket) socket.disconnect();
	socket = null;
}
