import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../assets/Logo 1.png";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) =>
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (formData.password.length < 6) {
			alert(
				"Password should be at least 6 characters.",
			);
			setLoading(false);
			return;
		}

		try {
			const userCredential =
				await createUserWithEmailAndPassword(
					auth,
					formData.email,
					formData.password,
				);
			if (userCredential.user && formData.username) {
				await updateProfile(userCredential.user, {
					displayName: formData.username,
				});
			}
			navigate("/");
		} catch (err) {
			console.error("Registration error:", err);
			alert(err.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center h-screen bg-slate-900">
			<div className="justify-center items-center pb-3">
				<img
					src={logo}
					alt="Logo"
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
					type="text"
					value={formData.username}
					name="username"
					onChange={handleChange}
					placeholder="Username"
					className="w-full border p-2 mb-3 rounded"
					required
				/>

				<input
					type="email"
					value={formData.email}
					name="email"
					placeholder="Email"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
					required
				/>

				<input
					type="password"
					name="password"
					value={formData.password}
					placeholder="Password"
					className="w-full p-2 mb-3 border rounded"
					onChange={handleChange}
					required
				/>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
				>
					{loading
						? "Creating account..."
						: "Sign Up"}
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
