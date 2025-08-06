import nodemailer from "nodemailer";
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

// Logo path relative to backend utilities (adjust if needed)
const logoPath = join(
	__dirname,
	"..",
	"..",
	"src",
	"assets",
	"Logo 1.png",
);

// Use VITE_ env vars via process.env (backend)
const SMTP_SERVICE =
	process.env.VITE_EMAIL_SERVICE || "gmail";
const SMTP_USER = process.env.VITE_EMAIL_USER;
const SMTP_PASS = process.env.VITE_EMAIL_PASS;
const EMAIL_FROM = process.env.VITE_EMAIL_FROM || SMTP_USER;
const EMAIL_RECEIVER = process.env.VITE_EMAIL_RECEIVER;

if (!SMTP_USER || !SMTP_PASS) {
	console.warn(
		"Warning: SMTP_USER or SMTP_PASS missing. Check VITE_EMAIL_USER and VITE_EMAIL_PASS in your .env",
	);
}

// Create transporter
export const transporter = nodemailer.createTransport({
	service: SMTP_SERVICE,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
});

// Run verify once at module load to surface common issues early.
// (It still makes sense to call verify again where you send.)
transporter.verify((err, success) => {
	if (err) {
		console.error(
			"Email transporter verify FAILED at startup:",
			err,
		);
	} else {
		console.log(
			"Email transporter verified and ready to send messages.",
		);
	}
});

/**
 * sendEmail - send different templates, with verbose logging
 * @param {string} type - "reset"|"reset-success"|"service-request"|"support"
 * @param {object} data - template data (email, username, resetLink, etc)
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

	const to = data.email || EMAIL_RECEIVER;
	if (!to) {
		throw new Error(
			"No recipient provided. Set data.email or VITE_EMAIL_RECEIVER in .env",
		);
	}

	const mailOptions = {
		from: `"${fromName}" <${EMAIL_FROM}>`,
		to,
		subject,
		html,
		attachments: [
			{
				filename: "logo.png",
				path: logoPath,
				cid: "syren-logo",
			},
		],
	};

	// Detailed logging
	console.log("sendEmail: about to send email");
	console.log("  type:", type);
	console.log("  from:", mailOptions.from);
	console.log("  to:", mailOptions.to);
	console.log("  subject:", mailOptions.subject);
	console.log("  smtp service:", SMTP_SERVICE);
	console.log(
		"  smtp user:",
		SMTP_USER ? SMTP_USER : "(none)",
	);

	try {
		// verify connection first (useful if verify at startup didn't run or environment changed)
		await transporter.verify();
		console.log(
			"transporter.verify() successful — proceeding to sendMail",
		);

		const info = await transporter.sendMail(
			mailOptions,
		);
		// log some fields from info
		console.log("Email sent successfully:");
		console.log("  messageId:", info.messageId);
		if (info.accepted)
			console.log("  accepted:", info.accepted);
		if (info.rejected)
			console.log("  rejected:", info.rejected);
		if (info.response)
			console.log("  response:", info.response);

		return info;
	} catch (err) {
		console.error("sendEmail error:", err);
		// Re-throw so callers can handle it (e.g., route returns 500)
		throw err;
	}
}
