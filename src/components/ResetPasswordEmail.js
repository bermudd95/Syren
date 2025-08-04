// ResetPasswordEmail.js
export default function ResetPasswordEmail({
	username,
	resetLink,
}) {
	return `
		<div style="font-family: Arial, sans-serif; padding: 20px;">
			<h2>Hi ${username},</h2>
			<p>We received a request to reset your password. Click the link below:</p>
			<a href="${resetLink}" style="padding: 10px 20px; background: #007BFF; color: white; text-decoration: none;">Reset Password</a>
			<p>If you didn't request this, please ignore this email.</p>
			<br/>
			<img src="cid:syren-logo" width="100" alt="Syren Logo" />
		</div>
	`;
}
