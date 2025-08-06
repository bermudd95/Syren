import { useState } from "react";
import logo from "../assets/Logo 1.png";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			// Use full backend URL if not proxied by Vite
			const res = await fetch(
				"http://localhost:5000/api/password/send-reset",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				},
			);

			// For cross-origin dev: if your backend runs on another port, use full URL:
			// const res = await fetch("http://localhost:5000/api/password/send-reset", { ... });

			if (!res.ok) {
				const err = await res
					.json()
					.catch(() => null);
				throw new Error(
					err?.message ||
						"Failed to send reset email",
				);
			}

			setMessage(
				"If the email exists, you will receive a reset link shortly. Check your inbox for an email from Syren Security.",
			);
			setEmail("");
		} catch (err) {
			console.error("Reset email error:", err);
			setMessage(
				err.message || "Error sending reset email.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center h-screen bg-slate-900">
			<img
				src={logo}
				alt="Logo"
				className="h-40 mb-4"
			/>
			<form
				onSubmit={handleSubmit}
				className="bg-white text-black p-6 rounded-xl shadow-xl w-96"
			>
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Reset Password
				</h2>
				<input
					type="email"
					name="email"
					value={email}
					placeholder="Enter your email"
					className="w-full p-2 mb-3 border rounded"
					onChange={(e) =>
						setEmail(e.target.value)
					}
					required
				/>
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-60"
				>
					{loading
						? "Sending..."
						: "Send Reset Email"}
				</button>
				{message && (
					<p className="mt-3 text-sm text-center text-gray-700">
						{message}
					</p>
				)}
			</form>
		</div>
	);
}
