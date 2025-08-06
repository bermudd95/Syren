import { useState, useEffect } from "react";
import {
	useSearchParams,
	useNavigate,
} from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const oobCode = searchParams.get("oobCode");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!oobCode) {
			setMessage(
				"Invalid or missing reset code. Make sure you used the link from your email.",
			);
		}
	}, [oobCode]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!oobCode) return;
		if (password.length < 6) {
			setMessage(
				"Password must be at least 6 characters.",
			);
			return;
		}
		setSubmitting(true);
		try {
			await confirmPasswordReset(
				auth,
				oobCode,
				password,
			);
			setMessage(
				"Password has been reset. Redirecting to login...",
			);
			setTimeout(() => navigate("/login"), 1500);
		} catch (err) {
			console.error("Reset error:", err);
			setMessage(
				err.message || "Could not reset password.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
			<form
				onSubmit={handleSubmit}
				className="p-6 rounded bg-white shadow-md space-y-4 w-full max-w-md"
			>
				<h2 className="text-xl font-bold">
					Reset Password
				</h2>

				<input
					type="password"
					placeholder="New password"
					value={password}
					onChange={(e) =>
						setPassword(e.target.value)
					}
					className="border p-2 w-full"
					required
				/>

				<button
					type="submit"
					disabled={submitting}
					className="bg-green-500 text-white px-4 py-2 rounded"
				>
					{submitting
						? "Resetting..."
						: "Reset Password"}
				</button>

				{message && (
					<p className="text-sm text-gray-600">
						{message}
					</p>
				)}
			</form>
		</div>
	);
}
