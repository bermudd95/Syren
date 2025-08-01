import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
	const { token } = useParams();
	const navigate = useNavigate();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] =
		useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setMessage("Passwords do not match.");
			return;
		}
		const res = await fetch(
			`/api/auth/reset-password/${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ newPassword }),
			},
		);
		const data = await res.json();
		if (res.ok) {
			setMessage(
				"✅ Password reset. Redirecting to login...",
			);
			setTimeout(() => navigate("/login"), 3000);
		} else {
			setMessage(`❌ ${data.error}`);
		}
	};

	useEffect(() => {
		if (!token) {
			setMessage("Invalid reset link.");
		}
	}, [token]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-6 rounded shadow-md w-80"
			>
				<h2 className="text-xl font-bold mb-4">
					Set New Password
				</h2>
				<input
					type="password"
					placeholder="New Password"
					value={newPassword}
					onChange={(e) =>
						setNewPassword(e.target.value)
					}
					className="w-full mb-3 p-2 rounded bg-gray-700"
					required
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					value={confirmPassword}
					onChange={(e) =>
						setConfirmPassword(e.target.value)
					}
					className="w-full mb-3 p-2 rounded bg-gray-700"
					required
				/>
				<button
					type="submit"
					className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
				>
					Reset Password
				</button>
				{message && (
					<p className="mt-3 text-sm text-center text-gray-300">
						{message}
					</p>
				)}
			</form>
		</div>
	);
}
