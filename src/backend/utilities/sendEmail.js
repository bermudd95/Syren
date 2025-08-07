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

// points to frontend asset at src/assets/Logo 1.png (adjust if your repo differs)
const logoPath = join(
	__dirname,
	"..",
	"..",
	"src",
	"assets",
	"Logo 1.png",
);

// optional hosted fallback (useful if clients block CID images)
const hostedLogoUrl = (
	process.env.VITE_HOSTED_LOGO_URL ||
	`${
		process.env.VITE_BACKEND_ORIGIN ||
		"http://localhost:5000"
	}/logo.png`
).replace(/\/+$/, "");

/** create transporter at runtime so env vars are read when function runs */
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

/** small helper - plain text fallback */
function plainTextFromHtml(html) {
	return (html || "")
		.replace(/<\/?[^>]+(>|$)/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * sendEmail(type, data)
 *
 * Supported types:
 *  - "reset"
 *  - "reset-success"
 *  - "service-request"     (legacy)
 *  - "support"             (legacy)
 *  - "assistance-admin"    (sends to ops inbox)
 *  - "assistance-client"   (confirmation to requester)
 *
 * data may include:
 *  - email OR to (recipient)
 *  - subject (override)
 *  - username, resetLink, name, phone, location, message, requestDate, requestId, contactEmail, etc.
 */
export async function sendEmail(type, data = {}) {
	let subject = data.subject || "Notification from Syren";
	let fromName = "Syren Security";
	let html = "";

	switch (type) {
		case "reset":
			fromName = "Syren Security Customer Support";
			subject =
				data.subject || "Reset your Syren password";
			html = resetPasswordTemplate({
				username: data.username,
				resetLink: data.resetLink,
			});
			break;

		case "reset-success":
			fromName = "Syren Security Customer Support";
			subject =
				data.subject ||
				"Your Syren password was reset";
			html = resetSuccessTemplate({
				username: data.username,
			});
			break;

		case "service-request":
			// legacy: internal service request format
			fromName = "Syren Security";
			subject =
				data.subject ||
				"Guard Assistance Requested";
			html = serviceRequestTemplate({
				name: data.name,
				phone: data.phone,
				location: data.location,
				message: data.message,
			});
			break;

		case "support":
			fromName = "Syren Security Customer Support";
			subject =
				data.subject || "Support Request Received";
			html = generalSupportTemplate({
				name: data.name,
				email: data.email,
				message: data.message,
			});
			break;

		case "assistance-admin":
			fromName = "Syren Security";
			subject =
				data.subject ||
				`🔔 Assistance Request from ${
					data.name || "Client"
				}`;
			// reuse serviceRequestTemplate but pass more fields (requestDate, contactEmail, requestId)
			html = serviceRequestTemplate({
				name: data.name,
				phone: data.phone,
				location: data.location,
				message: data.reason || data.message,
				requestDate: data.requestDate,
				contactEmail:
					data.contactEmail || data.email,
				requestId: data.requestId,
			});
			break;

		case "assistance-client":
			fromName = "Syren Security Customer Support";
			subject =
				data.subject ||
				"Syren Security — Assistance Request Received";
			// simple confirmation HTML (if you want fancier, move to templates)
			html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${escapeHtml(data.name || "there")},</h2>
          <p>We’ve received your assistance request dated ${escapeHtml(
				data.requestDate || data.date || "",
			)}.</p>
          <p>We will contact you at ${escapeHtml(
				data.phone || data.email || "",
			)} as soon as possible.</p>
          <p><strong>Request details</strong></p>
          <p>${escapeHtml(
				data.reason || data.message || "",
			)}</p>
          <br/>
          <p>Thank you,<br/>Syren Security Customer Support</p>
          <img src="${hostedLogoUrl}" alt="Syren Logo" width="120" style="display:block; margin-top:18px;" />
        </div>
      `;
			break;

		default:
			throw new Error("Unknown email type: " + type);
	}

	// determine recipient: prefer data.to then data.email then env receiver
	const to =
		data.to ||
		data.email ||
		process.env.VITE_EMAIL_RECEIVER;
	if (!to) {
		throw new Error(
			"No recipient provided. Set data.to/data.email or VITE_EMAIL_RECEIVER in .env",
		);
	}

	const fromAddress =
		process.env.VITE_EMAIL_FROM ||
		process.env.VITE_EMAIL_USER;
	const mailOptions = {
		from: `"${fromName}" <${fromAddress}>`,
		to,
		subject,
		html,
		text: plainTextFromHtml(html),
		headers: {
			"X-Syren-Source": "backend",
		},
	};

	// Attach logo inline only if file exists AND the template uses cid:syren-logo.
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
			// if the logo file isn't present, we already use hostedLogoUrl inside client template
			console.warn(
				`Logo not found at ${logoPath}. Using hosted logo URL or sending without inline logo.`,
			);
		}
	} catch (err) {
		console.warn("Error checking logo file:", err);
	}

	const transporter = createTransporter();

	try {
		await transporter.verify();
		console.log(
			`SMTP verify OK — sending "${subject}" to ${to}`,
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

/* small escape helper used in simple confirmation html */
function escapeHtml(str) {
	if (str === undefined || str === null) return "";
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
