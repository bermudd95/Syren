export default function ResetSuccessEmail({ username }) {
	return `export default function generateResetSuccessEmail({ username }) {
		<div style="font-family: Arial, sans-serif;">		<h2>Hello ${username},</h2>
			<p>Your password has been successfully reset.</p>
			<p>If this wasn’t you, please contact support immediately.</p>
			<img src="cid:syren-logo" alt="Syren Logo" style="width: 120px; margin-top: 20px;" />
		</div>
	`;
}
