export function resetPasswordTemplate({
	username = "there",
	resetLink,
}) {
	return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Reset your password</title>
  </head>
  <body style="font-family: Arial, sans-serif; background:#f4f6f8; margin:0; padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table width="600" style="background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="cid:syren-logo" alt="Syren Logo" width="120" style="display:block;" />
            </td>
          </tr>

          <tr>
            <td>
              <h2 style="margin:0 0 12px 0; color:#222;">Hi ${escapeHtml(
					username,
				)},</h2>
              <p style="color:#555; margin:0 0 18px 0;">
                We received a request to reset your password. Click the button below to set a new password.
                This link will expire in 15 minutes.
              </p>

              <p style="text-align:center; margin:20px 0;">
                <a href="${resetLink}" style="display:inline-block; padding:12px 22px; background:#0c6cf2; color:#fff; text-decoration:none; border-radius:6px; font-weight:600;">
                  Reset Password
                </a>
              </p>

              <p style="margin:8px 0 0 0; color:#777; font-size:13px;">
                If the button doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="word-break:break-all; color:#0c6cf2; font-size:13px;">${resetLink}</p>

              <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

              <p style="font-size:12px; color:#999; margin:0;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:20px; text-align:center; color:#aaa; font-size:12px;">
              &copy; ${new Date().getFullYear()} Syren Security — Protection you can trust
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
}

export function resetSuccessTemplate({
	username = "there",
}) {
	return `
  <!doctype html>
  <html>
  <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
  <body style="font-family: Arial, sans-serif; background:#f4f6f8; margin:0; padding:20px;">
    <table width="100%"><tr><td align="center">
      <table width="600" style="background:#fff; padding:28px; border-radius:8px;">
        <tr><td align="center"><img src="cid:syren-logo" alt="Syren" width="110" /></td></tr>
        <tr><td>
          <h2 style="color:#222;">Hello ${escapeHtml(
				username,
			)},</h2>
          <p style="color:#555;">Your password has been successfully reset. You can now log in using your new credentials.</p>

          <p style="text-align:center; margin:20px 0;">
            <a href="${
				process.env.FRONTEND_URL ||
				"http://localhost:5173"
			}/login" style="padding:10px 18px; background:#28a745; color:#fff; text-decoration:none; border-radius:6px;">Go to Login</a>
          </p>

          <p style="font-size:12px; color:#888;">If you did not perform this action, contact support immediately.</p>
        </td></tr>
        <tr><td style="padding-top:18px; text-align:center; color:#aaa; font-size:12px;">
          &copy; ${new Date().getFullYear()} Syren Security
        </td></tr>
      </table>
    </td></tr></table>
  </body>
  </html>
  `;
}

export function serviceRequestTemplate({
	name,
	phone,
	location,
	message,
}) {
	return `
  <!doctype html><html><body style="font-family: Arial, sans-serif; margin:0; padding:20px; background:#f4f6f8;">
    <table width="100%"><tr><td align="center">
      <table width="600" style="background:#fff; padding:24px; border-radius:8px;">
        <tr><td align="center"><img src="cid:syren-logo" alt="Syren" width="110" /></td></tr>
        <tr><td>
          <h2 style="color:#222;">Guard Assistance Requested</h2>
          <p style="color:#333;"><strong>Name:</strong> ${escapeHtml(
				name || "N/A",
			)}</p>
          <p style="color:#333;"><strong>Phone:</strong> ${escapeHtml(
				phone || "N/A",
			)}</p>
          <p style="color:#333;"><strong>Location:</strong> ${escapeHtml(
				location || "N/A",
			)}</p>
          <p style="color:#333;"><strong>Message:</strong></p>
          <p style="background:#f9fbff; padding:12px; border-left:4px solid #0c6cf2; color:#333;">${escapeHtml(
				message || "",
			)}</p>
        </td></tr>
        <tr><td style="padding-top:18px; color:#999; font-size:12px;">This request was submitted via the Syren client portal.</td></tr>
      </table>
    </td></tr></table>
  </body></html>
  `;
}

export function generalSupportTemplate({
	name,
	email,
	message,
}) {
	return `
  <!doctype html><html><body style="font-family: Arial, sans-serif; margin:0; padding:20px; background:#f4f6f8;">
    <table width="100%"><tr><td align="center">
      <table width="600" style="background:#fff; padding:24px; border-radius:8px;">
        <tr><td align="center"><img src="cid:syren-logo" alt="Syren" width="110" /></td></tr>
        <tr><td>
          <h2 style="color:#222;">Support Request</h2>
          <p style="color:#333;"><strong>From:</strong> ${escapeHtml(
				name || "N/A",
			)} (${escapeHtml(email || "")})</p>
          <p style="color:#333;"><strong>Message:</strong></p>
          <p style="background:#f9f9f9; padding:12px; color:#333;">${escapeHtml(
				message || "",
			)}</p>
        </td></tr>
        <tr><td style="padding-top:18px; color:#999; font-size:12px;">Support ticket generated from client portal.</td></tr>
      </table>
    </td></tr></table>
  </body></html>
  `;
}

/* small helper to avoid basic HTML injection when inserting user content */
function escapeHtml(str) {
	if (str === undefined || str === null) return "";
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
