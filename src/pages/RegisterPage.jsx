import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleChange = (e) =>
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(
			"http://localhost:5000/api/auth/forgot-password",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			},
		);
		const data = await res.json();
		console.log(data);

		if (res.ok) {
			navigate("/");
		} else {
			alert(data.message || "Registration failed");
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
					Sign Up
				</h2>
				<input
					type="username"
					value={formData.username}
					name="username"
					onChange={handleChange}
					placeholder="Username"
					className="w-full border p-2 mb-3 rounded"
				/>
				<input
					type="email"
					value={formData.email}
					name="email"
					placeholder="Email"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
				/>
				<input
					type="password"
					name="password"
					value={formData.password}
					placeholder="Password"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
				>
					Sign Up
				</button>
				<div className="text-sm mt-3 text-center">
					<a
						href="/login"
						className="text-blue-500 hover:underline"
					>
						Already have an account? Login
					</a>
				</div>
			</form>
		</div>
	);
}
