import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		if (res.ok) {
			localStorage.setItem("token", data.token);
			window.location.href = "/";
		} else {
			alert(data.error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-6 rounded shadow-md w-80"
			>
				<h2 className="text-xl font-bold mb-4">
					Login
				</h2>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) =>
						setEmail(e.target.value)
					}
					className="w-full mb-3 p-2 rounded bg-gray-700"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) =>
						setPassword(e.target.value)
					}
					className="w-full mb-3 p-2 rounded bg-gray-700"
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
				>
					Login
				</button>
				<div className="text-sm mt-3 text-center">
					<Link
						to="/reset-password"
						className="text-blue-400 hover:underline"
					>
						Forgot Password?
					</Link>{" "}
					|
					<Link
						to="/register"
						className="text-blue-400 hover:underline ml-1"
					>
						Create Account
					</Link>
				</div>
			</form>
		</div>
	);
}
