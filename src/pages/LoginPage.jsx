import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(
			"http://localhost:5000/api/auth/forgot-password",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
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
					Login
				</h2>
				<input
					type="email"
					value={form.email}
					name="email"
					placeholder="Email"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
				/>
				<input
					type="password"
					name="password"
					value={form.password}
					placeholder="Password"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
				>
					Login
				</button>
				<div className="text-sm mt-3 text-center">
					<Link
						to="/forgot-password"
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
