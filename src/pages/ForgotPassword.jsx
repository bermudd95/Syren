import { useState } from "react";
export default function ResetPasswordPage() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(
				"http://localhost:5000/api/auth/forgot-password",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				},
			);

			if (!res.ok) {
				const errorText = await res.text();
				console.error("Server error:", errorText);
				setMessage(
					"Something went wrong. Please try again.",
				);
				return;
			}
			const data = await res.json();
			setMessage(
				data.message ||
					"Password reset email sent.",
			);
		} catch (err) {
			console.error("Error sending reset link:", err);
			setMessage("Error sending reset link.");
		}
	};
	return (
		<div className="flex flex-col justify-center items-center h-screen bg-slate-900">
			<div className="justify-center items-center pb-3">
				<img
					src="./src/assets/Logo 1.png"
					alt="Logo image"
					className="h-40 w-auto rounded-lg"
				/>
			</div>
			<form
				onSubmit={handleSubmit}
				className="bg-white text-black p-6 rounded-xl shadow-xl w-96"
			>
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Set New Password
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
					className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
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
