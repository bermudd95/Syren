import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
	resetPasswordTemplate,
	resetSuccessTemplate,
	serviceRequestTemplate,
	generalSupportTemplate,
} from "../templates/emailTemplates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * logoPath: points to frontend asset at src/assets/Logo 1.png
 * We go up to the repo root and then into src/assets to match your path.
 */
const logoPath = join(
	__dirname,
	"..",
	"..",
	"assets",
	"Logo 1.png",
);

/**
 * Create transporter at runtime to ensure env vars are available
 */
function createTransporter() {
	const service =
		process.env.VITE_EMAIL_SERVICE || "gmail";
	const user = process.env.VITE_EMAIL_USER;
	const pass = process.env.VITE_EMAIL_PASS;

	if (!user || !pass) {
		const msg =
			"Missing SMTP credentials: VITE_EMAIL_USER and/or VITE_EMAIL_PASS not set";
		console.error(msg);
		throw new Error(msg);
	}

	// Support explicit host/port if provided, otherwise use service
	const host = process.env.VITE_EMAIL_HOST || null;
	const port = process.env.VITE_EMAIL_PORT
		? Number(process.env.VITE_EMAIL_PORT)
		: null;
	const secure = process.env.VITE_EMAIL_SECURE === "true";

	const transportOptions = host
		? {
				host,
				port: port || (secure ? 465 : 587),
				secure: !!secure,
				auth: { user, pass },
		  }
		: {
				service,
				auth: { user, pass },
		  };

	return nodemailer.createTransport(transportOptions);
}

/**
 * sendEmail(type, data)
 * type: "reset" | "reset-success" | "service-request" | "support"
 * data: object required by the templates (email, username, resetLink, etc.)
 */
export async function sendEmail(type, data = {}) {
	let subject = "Notification from Syren";
	let fromName = "Syren Security";
	let html = "";

	switch (type) {
		case "reset":
			fromName = "Syren Security Customer Support";
			subject = "Reset your Syren password";
			html = resetPasswordTemplate({
				username: data.username,
				resetLink: data.resetLink,
			});
			break;
		case "reset-success":
			fromName = "Syren Security Customer Support";
			subject = "Your Syren password was reset";
			html = resetSuccessTemplate({
				username: data.username,
			});
			break;
		case "service-request":
			fromName = "Syren Security";
			subject = "Guard Assistance Requested";
			html = serviceRequestTemplate({
				name: data.name,
				phone: data.phone,
				location: data.location,
				message: data.message,
			});
			break;
		case "support":
			fromName = "Syren Security Customer Support";
			subject = "Support Request Received";
			html = generalSupportTemplate({
				name: data.name,
				email: data.email,
				message: data.message,
			});
			break;
		default:
			throw new Error("Unknown email type: " + type);
	}

	const to =
		data.email || process.env.VITE_EMAIL_RECEIVER;
	if (!to)
		throw new Error(
			"No recipient provided. Set data.email or VITE_EMAIL_RECEIVER in .env",
		);

	const mailOptions = {
		from: `"${fromName}" <${
			process.env.VITE_EMAIL_FROM ||
			process.env.VITE_EMAIL_USER
		}>`,
		to,
		subject,
		html,
	};

	// Attach logo only if present, otherwise warn and continue
	try {
		if (fs.existsSync(logoPath)) {
			mailOptions.attachments = [
				{
					filename: "logo.png",
					path: logoPath,
					cid: "syren-logo",
				},
			];
		} else {
			console.warn(
				`⚠ Logo not found at ${logoPath}. Email will be sent without inline logo.`,
			);
		}
	} catch (err) {
		console.warn("Error checking logo file:", err);
	}

	// create transporter and send
	const transporter = createTransporter();

	try {
		await transporter.verify();
		console.log(
			"SMTP verify succeeded — sending email to:",
			to,
		);
	} catch (err) {
		console.error("SMTP verify failed:", err);
		throw err;
	}

	try {
		const info = await transporter.sendMail(
			mailOptions,
		);
		console.log("Email sent:", {
			messageId: info.messageId,
			accepted: info.accepted,
			rejected: info.rejected,
		});
		return info;
	} catch (err) {
		console.error("sendMail error:", err);
		throw err;
	}
}
