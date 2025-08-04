import ReactDOMServer from "react-dom/server";
import React from "react";
import nodemailer from "nodemailer";
import ResetPasswordEmail from "../../components/ResetPasswordEmail.js";
import ResetSuccessEmail from "../../components/ResetSuccessEmail.js";
import path from "path";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "danny.bermudez8@gmail.com",
		pass: "ivrxzaxpaosjyyir",
	},
});

const logoPath = path.join(
	process.cwd(),
	"src",
	"assets",
	"logo 1.png",
);

export const sendResetEmail = async ({
	email,
	username,
	resetLink,
}) => {
	console.log("Rendering email content");
	const htmlContent = ResetPasswordEmail({
		username,
		resetLink,
	});

	console.log("Sending email to:", email);

	await transporter.sendMail({
		from: '"Syren Support" <no-reply@syren.com>',
		to: email,
		subject: "Reset Your Password",
		html: htmlContent,
		attachments: [
			{
				filename: "logo.png",
				path: logoPath,
				cid: "syren-logo", // Used in <img src="cid:syren-logo">
			},
		],
	});
	transporter.verify((error, success) => {
		if (error) {
			console.error(
				"Transporter config error:",
				error,
			);
		} else {
			console.log("Ready to send email ✅");
		}
	});
};

export const sendResetSuccessEmail = async ({
	email,
	username,
}) => {
	const htmlContent = ResetSuccessEmail({
		username,
	});

	await transporter.sendMail({
		from: '"Syren Support" <no-reply@syren.com>',
		to: email,
		subject: "Your Password Has Been Reset",
		html: htmlContent,
		attachments: [
			{
				filename: "logo.png",
				path: logoPath,
				cid: "syren-logo",
			},
		],
	});
};
