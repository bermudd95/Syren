import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
	const { token } = useParams();
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(
				`http://localhost:5000/api/auth/reset-password/${token}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ password }),
				},
			);
			const data = await res.json();
			setMessage(data.message);
		} catch (err) {
			setMessage("Error resetting password");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={handleSubmit}
				className="p-6 rounded bg-white shadow-md space-y-4"
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
				/>
				<button className="bg-green-500 text-white px-4 py-2 rounded">
					Reset Password
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
